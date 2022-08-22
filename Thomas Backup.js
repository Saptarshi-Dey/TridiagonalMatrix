const { stdout } = require('process');
const { factor, NArray, BetaArray, A,B,C, n,m} = require('./Initialization');

//const m = 6, n = 7;
var matrix1 = [];

//arr Initialization
for(let i=0;i<n;i++){
    let arr = [];
    for(let j=0;j<m;j++){
        if(i==0 || j==0 || i==n-1 || j==m-1) arr.push(0);
        else arr.push(1);
    }
    matrix1.push([...arr]);
}

var matrix2 = [...matrix1];

var D2 = (i,j)=>{
    //let j2 = j;//(j==m-2)?m-3:j;
    let t = 2.78+0.00125*(Math.pow(BetaArray[i][j],2)-Math.pow(factor*NArray[i][j],2));
    return -0.0025*(matrix2[i][j+1]-t*matrix2[i][j]+matrix2[i][j-1]);
}
//m-1
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
        temp /= den;
        let diagup = (k == 1)?1:2;
        den = arr[k][1] - arr[k-1][diagup]*arr[k][0]/den;
        temp = b[k] - temp*arr[k][0];
    }

    temp /= den;
    temp = b[b.length-1] - temp*arr[arr.length-1][1];  //Value of Last R(n)
    den = arr[arr.length-1][2] - arr[arr.length-2][2]*arr[arr.length-1][1]/den;

    //TODO: Back Substitution
    var lastVar2 = temp/den, lastVar = (b[b.length-1]-lastVar2*arr[arr.length-1][2])/arr[arr.length-1][1];
    matrix1[n-3][j] = lastVar; matrix1[n-2][j] = lastVar2;

    for(let i=arr.length-2;i>0;i--){
        var sum = arr[i][1]*lastVar + arr[i][2]*lastVar2,
            newRoot = (b[i] - sum)/arr[i][0];
        matrix1[i][j] = newRoot;
        lastVar2 = lastVar;
        lastVar = newRoot;
    }

    /*for(let t=0;t<b.length;t++){
        if(t==0){
            console.log(arr[t][0],"*",matrix1[t+1][j],"+",arr[t][1],"*",matrix1[t+2][j],"=",b[t]);
        }
        else if(t == b.length-1){
            console.log(arr[t][1],"*",matrix1[t][j],"+",arr[t][2],"*",matrix1[t+1][j],"=",b[t]);
        }
        else{
            console.log(arr[t][0],"*",matrix1[t][j],"+",arr[t][1],"*",matrix1[t+1][j],"+",arr[t][2],"*",matrix1[t+2][j],"=",b[t]);
        }
    } console.log("\n");*/
    /*for(let i=0;i<arr.length;i++){
        for(let j=0;j<arr[i].length;j++) stdout.write(arr[i][j].toString()+" ");
        stdout.write("\n");
    }
    for(let i=0;i<b.length;i++){
        stdout.write(b[i].toString()+" ");
    }*/
    //console.log(arr,b);
    //if(b.length == arr.length) console.log("\n",b.length);
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

    /*for(let t=0;t<b.length;t++){
        if(t==0){
            console.log(arr[t][0],"*",matrix2[i][t+1].toFixed(6),"+",arr[t][1],"*",matrix2[i][t+2].toFixed(6),"=",b[t].toFixed(6));
        }
        else if(t == b.length-1){
            console.log(arr[t][1],"*",matrix2[i][t].toFixed(6),"+",arr[t][2],"*",matrix2[i][t+1].toFixed(6),"=",b[t].toFixed(6));
        }
        else{
            console.log(arr[t][0],"*",matrix2[i][t].toFixed(6),"+",arr[t][1],"*",matrix2[i][t+1].toFixed(6),"+",arr[t][2],"*",matrix2[i][t+2].toFixed(6),"=",b[t].toFixed(6));
        }
    } console.log("\n");*/
}

/*for(let i=1;i<matrix1.length-1;i++){
    //for(let j=0;j<matrix1[i].length;j++)
    stdout.write("Var_"+(n-i-1).toString()+" = "+matrix1[n-i-1][1].toString()+" ");
    stdout.write("\n");
}
for(let i=0;i<matrix2.length;i++){
    for(let j=0;j<matrix2[i].length;j++) stdout.write(matrix2[i][j].toString()+((j==matrix2[i].length-1)?"":" "));
    stdout.write("\n");
}*/