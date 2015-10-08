function Randoms(){
    this.normalRandom=function(){
        var u_1, u_2;
        u_1 = Math.random();
        u_2 = Math.random();
        return (Math.sqrt(-1*Math.log(u_1))*Math.sin(2*Math.PI));
    };
}