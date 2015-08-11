function graph(context, width, height){
    //pixel width and height
    this.width = width;
    this.height=height;

    //set boundaries, which also sets scale
    this.setBoundaries=function(x,y){
        this.pixels_per_x=width/(x[1]-x[0]);
        this.pixels_per_y=height/(y[1]-y[0]);
        this.xBounds=x;
        this.yBounds=y;
    };

    //set graph origin and width
    this.drawAxes=function(){
        //Determine where we start drawing
        startx=(((width/2)/this.pixels_per_x)%1)*this.pixels_per_x;
        starty=(((height/2)/this.pixels_per_y)%1)*this.pixels_per_y;

        //draw grid for unit scale
        context.beginPath();
        context.strokeStyle="gray";
        context.lineWidth=1;
        for(var i=startx; i < width; i+=pixels_per_x){
            context.moveTo(i,0);
            context.lineTo(i,height);
            context.stroke();
        }
        for(var i=starty; i < width; i+=pixels_per_y){
            context.moveTo(0,i);
            context.lineTo(width,i);
            context.stroke();
        }
        //axes drawing
        context.beginPath();
        context.strokeStyle="black";
        context.lineWidth=2;
        //draw main X
        context.moveTo(0,height/2);
        context.lineTo(width, height/2);
        context.stroke();
        //draw main Y
        context.moveTo(width/2,0);
        context.lineTo(width/2,height);
        context.stroke();
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
    var mygraph = new graph(context);
    mygraph.setBoundaries([-4,4],[-4,4]);
    mygraph.drawAxes(canvas.width, canvas.height, 14, 14);
    //mygraph.graph(function(x){ return x*x; }, [-2,2], "red");
}
