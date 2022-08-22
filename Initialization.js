const lambda = 1.55,
      aa1 = 1.05,
      aa2 = 3.0,
      aa3 = 1.05,
      bb1 = 1.125125,
      bb2 = 1.5,
      bb3 = 1.5;

const A1 = aa1+aa2+aa3,
      B1 = bb1+bb2+bb3;

const hx = 0.09, hy = 0.09;

const temp1 = 6.8*Math.PI/lambda,
      temp2 = 6.88*Math.PI/lambda,
      temp3 = 2*Math.PI/lambda;

var N = [], Beta = [];

const m1 = Math.floor(A1/hx),
m2 = Math.floor(aa1/hx),
m3 = Math.floor((aa1+aa2)/hx),

n1 = Math.floor(B1/hy),
n2 = Math.floor(bb1/hy),
n3 = Math.floor((bb1+bb2)/hy);

var X = (i)=> {return i*hx; }
var Y = (i)=> {return i*hy; }

for(let i=0;i<n2;i++){
    let arr = [], bita = [];
    for(let j=0;j<m1;j++){
        arr.push(3.40);
        bita.push(temp1);
    } N.push([...arr]); Beta.push([...bita]);
}

for(let i=n2;i<n3;i++){
    let arr = [], bita = [];
    for(let j=0;j<m1;j++){
        arr.push(3.44+Math.pow(X(i)+Y(j),-7));
        bita.push(temp2);
    } N.push([...arr]); Beta.push([...bita]);
}

for(let i=n3;i<n1;i++){
    let arr = [], bita = [];
    for(let j=0;j<m2;j++){
        arr.push(1.0);
        bita.push(temp3);
    }
    for(let j=m2;j<m3;j++){
        arr.push(3.44+Math.pow(X(i)+Y(j),-7));
        bita.push(temp2);
    }
    for(let j=m3;j<m1;j++){
        arr.push(1.0);
        bita.push(temp3);
    } N.push([...arr]); Beta.push([...bita]);
}

var AA = (i,j)=>{
    let p1 = N[i][j];
    let p2 = N[i+1][j];
    p1 *= p1;
    p2 *= p2;
    let p = p1*0.005;
    return p/(p1+p2);
}

var BB = (i,j)=>{
    let p1 = N[i][j];
    let p2 = N[i+1][j];
    let p3 = N[i-1][j];
    p1 *= p1;
    p2 *= p2;
    p3 *= p3;
    let a = (p2-p1)/(p2+p1);
    let b = 2.78+0.00125*(Math.pow(Beta[i][j],2)-Math.pow(temp3*N[i][j],2));
    let c = (p3-p1)/(p3+p1);
    return (a-b+c)*0.0025;
}

var CC = (i,j)=>{
    let p1 = N[i][j];
    let p2 = N[i-1][j];
    p1 *= p1;
    p2 *= p2;
    let p = p1*0.005;
    return p/(p1+p2);
}

var A = [];
var B = [];
var C = [];

for(let i=1;i<n1-1;i++){
    let arr1 = [], arr2 = [], arr3 = [];
    for(let j=1;j<m1-1;j++){
        arr1.push(AA(i,j));
        arr2.push(BB(i,j));
        arr3.push(CC(i,j));
    } A.push([...arr1]); B.push([...arr2]); C.push([...arr3]);
}

module.exports.n = n1;
module.exports.m = m1;
module.exports.NArray = N;
module.exports.BetaArray = Beta;
module.exports.factor = temp3;
module.exports.A = A;
module.exports.B = B;
module.exports.C = C;