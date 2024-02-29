




let arr=[];
for(let entry of result.data){
    let bool=false;
    for(let x in entry){
        if(entry[x]=='' || entry[x]=='nan' || entry[x]=='0'){
            bool=true;
            break;
        }
    }
    if(bool) continue;

    arr.push(entry);
}





