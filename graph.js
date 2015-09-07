//Creating graphObject so we can re-render the same function by keeping it in memory
function graphObjectProto(){                                                                   
    this.setColor=function(x){
        this.color=x;
    }
    this.getColor=function(){
        return this.color;
    }
    this.getFunc=function(){
        return (this.func);
    }
    this.setDomain=function(domain){
        this.domain=domain;
    }
    this.getDomain=function(){
        return this.domain;
    }
    this.setPts=function(x,y){
        this.dataPts=[x,y];
    }
    this.getPts=function(){
        return this.dataPts;
    }
}

function graphObject(func, domain, color){
    this.func=func;
    this.domain=domain;
    this.color=color;
    this.dataPts=[];
}
graphObject.prototype=new graphObjectProto();

//Graph object that maintains the graph state and operates canvas
function graph(context, width, height){
    //pixel width and height
    this.width =width;
    this.height=height;
    this.context=context;
    this.x_direction=0; //Direction of increasing/decreasing values
    this.y_direction=0;
    this.x_axis_loc=0;
    this.y_axis_loc=0;
    this.entityList=[];

    //set boundaries, which also sets scale
    this.setBoundaries=function(x,y){
        this.pixels_per_x=width/Math.abs((x[1]-x[0]));
        this.pixels_per_y=height/Math.abs((y[1]-y[0]));
        this.x_direction=Math.abs((x[1]-x[0]))/(x[1]-x[0]);
        this.y_direction=Math.abs((y[1]-y[0]))/(y[1]-y[0]);
        this.xBounds=x;
        this.yBounds=y;
        //this.x_axis_loc=this.y_direction*y[1];  //why
        this.x_axis_loc=this.y_direction*y[1];  //why
        this.y_axis_loc=-1*this.x_direction*x[0];
        this.drawGrid();
        this.drawAxes();
    };

    //nested ifs for clarity at the cost of speed
    this.drawAxes=function(){
        //There x and y both have two options for their direction and placement
        //they should basically act as a reference point to where 0,0 axes are
        //relative to our function grid
        //axes drawing

        var x_draw=this.x_axis_loc*this.pixels_per_y;
        var y_draw=this.y_axis_loc*this.pixels_per_x;

        if (x_draw > this.height){
            x_draw = this.height-1;
        }else if(x_draw < 0){
            x_draw = 1;
        }

        if (y_draw > this.width){
            y_draw = this.width-1;
        }else if(y_draw < 0){
            y_draw = 1;
        }

        context.beginPath();
        context.strokeStyle="black";
        context.lineWidth=2;
        //draw main X
        context.moveTo(0,x_draw);
        context.lineTo(width, x_draw);
        context.stroke();
        //draw main Y
        context.moveTo(y_draw,0);
        context.lineTo(y_draw,height);
        context.stroke();
    }

    //set graph origin and width
    this.drawGrid=function(){
        //grid also needs to keep track of direcitonality
        //if direction<0 startx=1-math.abs(bounds[0]%1); else startx=math.abs(bounds[0]%1)
        var startx = Math.abs(this.xBounds[0]%1);
        startx = this.x_direction<0 ? 1-startx : startx;

        var starty = Math.abs(this.yBounds[1]%1);
        starty = this.y_direction>0 ? 1-starty : starty;
        //draw grid for unit scale
        context.beginPath();
        context.strokeStyle="gray";
        context.lineWidth=1;
        for(var i=startx*this.pixels_per_x; i <= width; i+=this.pixels_per_x){
            context.moveTo(i,0);
            context.lineTo(i,height);
            context.stroke();
        }
        for(var i=starty*this.pixels_per_y; i <= height; i+=this.pixels_per_y){
            context.moveTo(0,i);
            context.lineTo(width,i);
            context.stroke();
        }
    };

    this.transform=function(x,y){
        return [this.pixels_per_x*(this.y_axis_loc+this.x_direction*x), this.pixels_per_y*(this.x_axis_loc-this.y_direction*y)];
    }

    //interpolates x and y array, pre-condition:x.length==y.length
    //TODO: Add discarding value for all out of bounds javascript more precise floatpoints, minus the first one, so our
    //spline at least goes to the border of our graph
    this.lspline=function(x,y,color){
        context.beginPath();
        if (typeof color == "undefined"){
            color="blue";   //where our default graph color is set for now
        }
        context.strokeStyle=color;
        context.lineWidth=1;
        var t_v=this.transform(x[0],y[0]);
        context.moveTo(t_v[0],t_v[1]);
        for (var i=1; i<x.length;i++){
            t_v=this.transform(x[i],y[i]);
            context.lineTo(t_v[0],t_v[1]);
        }
        context.stroke();
    }

    //Makes points in domain with specified pixels_per_step
    this.makePoints=function(func,domain,pixels_per_step){
        var x=[],y=[];
        var pixels_per_step=2;
        step=pixels_per_step/this.pixels_per_x;
        for (var i=domain[0]; i<=domain[1]; i+=step){
            x.push(i);
            y.push(func(i));
        }
        return ([x,y]);
    }

    //not memory efficient
    this.addGraph=function(func,domain,color){
        var pts=this.makePoints(func,domain,2);   //2 pixels per step
        this.lspline(pts[0],pts[1],color);
        var new_graph=new graphObject(func, domain, color);
        new_graph.setPts(pts[0],pts[1]);
        this.entityList.push(new_graph);
    }

    //not memory efficient, there's probably a better way to do this than by making
    //a separate redraw function for graphobjects already in the entityList. perhaps an id test
    this.regraph=function(func, domain, color){
        var pts=this.makePoints(func,domain,2);   //2 pixels per step
        this.lspline(pts[0],pts[1],color);
    }
    
    this.scaleBounds=function(percent){
        this.clearScreen();
        //sizex=Math.abs(this.xBounds[0]-this.xBounds[1]);
        //sizey=Math.abs(this.yBounds[0]-this.yBounds[1]);
        //var incx=(sizex*percent-sizex)/2;
        //var incy=(sizey*percent-sizey)/2;
        if (percent > 1)
        {
            incx=-1;
            incy=-1;
        }
        else
        {
            incx=1;
            incy=1;
        }
        var new_x_bounds = [this.xBounds[0]-this.x_direction*incy,this.xBounds[1]+this.x_direction*incx];
        var new_y_bounds = [this.yBounds[0]-this.y_direction*incx,this.yBounds[1]+this.y_direction*incy];
        //clear screen right before drawing operations
        this.clearScreen();
        this.setBoundaries(new_x_bounds,new_y_bounds);
    }

    this.zoomOut=function(percent){
        this.scaleBounds(percent);
        for (var i in this.entityList){
            var color=this.entityList[i].getColor();
            var pts=this.entityList[i].getPts();
            this.lspline(pts[0],pts[1],color);
        }
    }

    //zooming in requires recalculation of points to avoid precision loss, only within the viewed interval
    this.zoomIn=function(percent){
        this.scaleBounds(1+percent);
        for (var i in this.entityList){
            var color=this.entityList[i].getColor();
            var domain=this.entityList[i].getDomain();
            this.regraph(this.entityList[i].getFunc(),domain,color);
        }
    }

    this.clearScreen=function(){
        this.context.clearRect(0,0,this.width,this.height);
    }
};

function Randoms(){
    //Generates a standard normal random variable unless mean and standard deviation is specified
    this.normalRandom=function(mean, standard_deviation){
        var u_1, u_2;
        //DEFAULT PARAMS
        if (typeof mean == "undefined")
        {
            mean=0;
        }
        if (typeof standard_deviation == "undefined")
        {
            standard_deviation=1;
        }
        u_1 = Math.random();
        u_2 = Math.random();
        //inverse of standard normal transformation
        return standard_deviation*(Math.sqrt(-2*Math.log(u_1))*Math.sin(2*Math.PI*u_2))+mean;
    };
}

window.onload = function(){
    canvas=document.getElementById("my_canvas");
    context=canvas.getContext("2d");
    mygraph = new graph(context, canvas.width, canvas.height);
    mygraph.setBoundaries([-3.5,2.2],[1.8,-1.5]);   //1.8, -1.5 works, 2.2, -4.1 does not grid drawn wrong
    mygraph.lspline([-1,1,2,3,4],[2,1,3,-2,5],"red");
    mygraph.addGraph(function(x){ return x*x; }, [-2,1]);
}


//TODO: make zoom in&out feature, make simple separate GUI module for function input & buttons, add functions-as-entities OO hierarchy and options for each entity so you can change color, interval, time as parameter, etc...
