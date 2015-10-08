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

