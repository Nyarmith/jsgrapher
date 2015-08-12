function graph(context, width, height){
    //pixel width and height
    this.width =width;
    this.height=height;
    this.context=context;

    //set boundaries, which also sets scale
    this.setBoundaries=function(x,y){
        this.pixels_per_x=width/Math.abs((x[1]-x[0]));
        this.pixels_per_y=height/Math.abs((y[1]-y[0]));
        this.xBounds=x;
        this.yBounds=y;
        this.drawGrid();
        this.drawAxes();
    };

    this.drawAxes=function(){
        //There x and y both have two options for their direction and placement
        //they should basically act as a reference point to where 0,0 axes are
        //relative to our function grid
        //axes drawing
        var x_axis_loc=0;
        var y_axis_loc=0;
        
        //This will make y axis appear in middle of screen
        if (this.xBounds[0]<0 && this.xBounds[1]>0){
            y_axis_loc=Math.abs(this.xBounds[0])*this.pixels_per_x;
        }
        else if(this.xBounds[0]>0 && this.xBounds[1]<0){
            y_axis_loc=Math.abs(this.xBounds[1])*this.pixels_per_x;
        }
        else if(this.xBounds[0]<=0 && this.xBounds[1]<=0){  //both intervals are above x
            y_axis_loc=width-1;
        }
        else{
            y_axis_loc=1;
        }

        //This will make x axis appear in middle of screen
        if (this.yBounds[0]<0 && this.yBounds[1]>0){
            //remember we draw from top left
            x_axis_loc=Math.abs(this.yBounds[1])*this.pixels_per_y;
        }
        else if(this.xBounds[0]>0 && this.xBounds[1]<0){
            x_axis_loc=Math.abs(this.yBounds[0])*this.pixels_per_y;
        }
        else if(this.yBounds[0]<=0 && this.yBounds[1]<=0){  //both intervals are above x
            x_axis_loc=1;
        }
        else{
            x_axis_loc=height-1;
        }
        context.beginPath();
        context.strokeStyle="black";
        context.lineWidth=2;
        //draw main X
        context.moveTo(0,x_axis_loc);
        context.lineTo(width, x_axis_loc);
        context.stroke();
        //draw main Y
        context.moveTo(y_axis_loc,0);
        context.lineTo(y_axis_loc,height);
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
    //this.translate();
    /*
    this.graph=function(func, domain, color){
        N=20;
        step=(domain[1]-domain[0])/N;
        context.moveTo(domain[0]+width/2,);
        for (var i=domain[0]+step; i<domain[1]; i+=step){
           context.beginPath();
        }
    }
    */
};

window.onload = function(){
    canvas=document.getElementById("my_canvas");
    context=canvas.getContext("2d");
    var mygraph = new graph(context, canvas.width, canvas.height);
    mygraph.setBoundaries([1,-4],[2,-4]);
    //mygraph.graph(function(x){ return x*x; }, [-2,2], "red");
}
