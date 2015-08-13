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
        this.x_axis_loc=-1*this.y_direction*y[0];
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
        //draw grid for unit scale
        context.beginPath();
        context.strokeStyle="gray";
        context.lineWidth=1;
        for(var i=0; i <= width; i+=this.pixels_per_x){
            context.moveTo(i,0);
            context.lineTo(i,height);
            context.stroke();
        }
        for(var i=0; i <= height; i+=this.pixels_per_y){
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

    //not memory efficient
    this.graph=function(func, domain, color){
        var x=[],y=[];
        var pixels_per_step=2;
        step=pixels_per_step/this.pixels_per_x;
        for (var i=domain[0]; i<=domain[1]; i+=step){
            x.push(i);
            y.push(func(i));
        }
        this.lspline(x,y,color);
        var new_graph=new graphObject(func, domain, color);
        new_graph.setPts(x,y);
        this.entityList.push(new_graph);
    }

    this.zoomOut(){
    }

    //zooming in requires recalculation of points to avoid precision loss, only within the viewed interval
    this.zoomIn(){
    }
};

window.onload = function(){
    canvas=document.getElementById("my_canvas");
    context=canvas.getContext("2d");
    var mygraph = new graph(context, canvas.width, canvas.height);
    mygraph.setBoundaries([-3,2],[-4,2]);
    mygraph.lspline([-1,1,2,3,4],[2,1,3,-2,4],"red");
    mygraph.graph(function(x){ return x*x; }, [-2,1]);
}

//TODO: make zoom in&out feature, make simple separate GUI module for function input & buttons, add functions-as-entities OO hierarchy and options for each entity so you can change color, interval, time as parameter, etc...
