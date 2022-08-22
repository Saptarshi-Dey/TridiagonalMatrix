const { stdout } = require('process');
const { factor, NArray, BetaArray, A,B,C, n,m} = require('./Initialization');

var matrix1 = [];
var matrix2 = [];
var matrix3 = [];

for(let i=0;i<n;i++){
    let arr = [];
    for(let j=0;j<m;j++){
        if(i==0 || j==0 || i==n-1 || j==m-1) arr.push(0);
        else arr.push(1);
    }
    matrix1.push([...arr]);
}

for(let i=0;i<n;i++){
    let arr = [];
    for(let j=0;j<m;j++){
        if(i==0 || j==0 || i==n-1 || j==m-1) arr.push(0);
        else arr.push(1);
    }
    matrix2.push([...arr]);
}

for(let i=0;i<n;i++){
    let arr = [];
    for(let j=0;j<m;j++){
        if(i==0 || j==0 || i==n-1 || j==m-1) arr.push(0);
        else arr.push(1);
    }
    matrix3.push([...arr]);
}

var maxError = 1.0, iterations = 0;

var D2 = (i,j)=>{
    let t = 2.78+0.00125*(Math.pow(BetaArray[i][j],2)-Math.pow(factor*NArray[i][j],2));
    return -0.0025*(matrix2[i][j+1]-t*matrix2[i][j]+matrix2[i][j-1]);
}

var B2 = (i,j)=>{
    let t = 2.78+0.00125*(Math.pow(BetaArray[i][j],2)-Math.pow(factor*NArray[i][j],2));
    return t*(-1);
}

var D1 = (i,j)=>{
    try{
        let t = A[i-1][j-1]*matrix1[i+1][j]+B[i-1][j-1]*matrix1[i][j]+C[i-1][j-1]*matrix1[i-1][j];
        return t*(-1);
    }catch(err){
        console.log(i,j,A[i],matrix1[i+1],matrix1[i],matrix1[i-1],err);
    }
}

function getMaxError(){
    var error = 0.0;
    for(let i=0;i<matrix2.length;i++){
        for(let j=0;j<matrix2[i].length;j++){
            let abs = Math.abs(matrix2[i][j]-matrix3[i][j]);
            if(error<abs) error = abs;
        }
    } return error;
}

function copyMatrix(){
    for(let i=0;i<matrix2.length;i++){
        for(let j=0;j<matrix2[i].length;j++) matrix3[i][j] = matrix2[i][j];
    }
}

while(maxError>0.001 && iterations<5){ iterations++;
    copyMatrix();

    for(let j=1;j<m-1;j++){
        let arr = [], b = [];
        b.push(D2(1,j));
        arr.push([B[0][j-1],A[0][j-1],0.0]);
        
        for(let i=1;i<n-3;i++){
            arr.push([C[i][j-1],B[i][j-1],A[i][j-1]]);
            b.push(D2(i+1,j));
        }
        b.push(D2(n-2,j));
        arr.push([0.0,C[n-3][j-1],B[n-3][j-1]]);
        
        var den = arr[0][0];
        var temp = b[0];

        for(let k=1;k<arr.length-1;k++){
            if(den == 0.0) den = arr[k][0];
            temp /= den;
            let diagup = (k == 1)?1:2;
            den = arr[k][1] - arr[k-1][diagup]*arr[k][0]/den;
            temp = b[k] - temp*arr[k][0];
        }

        temp /= den;
        temp = b[b.length-1] - temp*arr[arr.length-1][1];  //Value of Last R(n)
        den = arr[arr.length-1][2] - arr[arr.length-2][2]*arr[arr.length-1][1]/den;

        //TODO: Back Substitution
        let lastVar2 = temp/den, lastVar = (b[b.length-1]-lastVar2*arr[arr.length-1][2])/arr[arr.length-1][1];
        matrix1[n-3][j] = lastVar; matrix1[n-2][j] = lastVar2;

        for(let i=arr.length-2;i>0;i--){
            var sum = arr[i][1]*lastVar + arr[i][2]*lastVar2,
                newRoot = (b[i] - sum)/arr[i][0];
            matrix1[i][j] = newRoot;
            lastVar2 = lastVar;
            lastVar = newRoot;
        }
    }

    for(let i=1;i<n-1;i++){
        let arr = [], b = [];
        b.push(D1(i,1)*400);
        arr.push([1.0,B2(i,1),0.0]);
        
        for(let j=1;j<m-3;j++){
            arr.push([1.0,B2(i,j+1),1.0]);
            b.push(D1(i,j+1)*400);
        }
        b.push(D1(i,m-2)*400);
        arr.push([0.0,B2(i,m-2),1.0]);
        
        var den = arr[0][0];
        var temp = b[0];

        for(let k=1;k<arr.length-1;k++){
            if(den == 0.0) den = arr[k][0];
            temp /= den;
            let diagup = (k == 1)?1:2;
            den = arr[k][1] - arr[k-1][diagup]*arr[k][0]/den;
            temp = b[k] - temp*arr[k][0];   
        }

        temp /= den;
        temp = b[b.length-1] - temp*arr[arr.length-1][1];  //Value of Last R(n)
        den = arr[arr.length-1][2] - arr[arr.length-2][2]*arr[arr.length-1][1]/den; 

        //TODO: Back Substitution
        let lastVar2 = temp/den, lastVar = (b[b.length-1]-lastVar2*arr[arr.length-1][2])/arr[arr.length-1][1];
        matrix2[i][m-3] = lastVar; matrix2[i][m-2] = lastVar2;

        for(let j=arr.length-2;j>0;j--){
            var sum = arr[j][1]*lastVar + arr[j][2]*lastVar2,
                newRoot = (b[j] - sum)/arr[j][0];
            matrix2[i][j] = newRoot;
            lastVar2 = lastVar;
            lastVar = newRoot;
        }
    }

    let maxError2 = getMaxError();
    if(maxError2>maxError) console.log("Error greater than last time");
    maxError = maxError2;
}

console.log("Iterations =",iterations);
console.log("Max Error =",maxError,"\n");

for(let i=0;i<matrix2.length;i++){
    for(let j=0;j<matrix2[i].length;j++) stdout.write(matrix2[i][j].toString()+((j==matrix2[i].length-1)?"":" "));
    stdout.write("\n");
}