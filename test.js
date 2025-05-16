const {interval}=require('rxjs');
const myPromise = new Promise((resolve,reject)=>{
    const success = true;
    if(success){
        resolve("Promise is resolved");
    }else{
        reject("Promise is rejected");
    }
});

myPromise
    .then(result=>console.log(result))
    .catch(error=>console.log(error))
    .finally(()=>console.log("Promise is settled"));
    const array = [1,2,3,4,5,6,7,8,9,10]; 



async function test(){
    function delay(ms){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(`等待了 ${ms/1000} 秒`);
        },ms);
    });
}
    const result = await delay(2000);
    console.log(result);
}
test();

function isEven(num){
   return num%2==0;
}
    
function filterEven(array){
    return array.filter(isEven);
}
const evenNumbers = filterEven(array);
console.log(evenNumbers);  


function iseven(array){
    return evennum = array.filter(num=>num%2==0);
}
console.log(iseven([1,2,3,4,5,6,7,8,9,10]));

async function fetchData(url){
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;   
    }
    catch(error){
        console.error(error);
    }
    
}

fetchData('https://jsonplaceholder.typicode.com/todos/1')
  .then(console.log);


async function fetchAllurl(urls){
    try{
        const responses = await Promise.all(urls.map(url=>fetch(url)));
        if(responses.some(response=>!response.ok)){
            throw new Error("Network response was not ok");
        }
        const data = await Promise.all(responses.map(response=>response.json()));
        return data;
    }
    catch(error){
        console.error(error);
        return "有请求失败";
    }
}

async function fetchWithRetry(url,retries=3){
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    }
    catch(error){
        await delay(3000);
        console.log("等待了三秒");
        if(retries>0){
            console.error(`Fetch failed: ${error}. Retrying...`);
            return fetchWithRetry(url,retries-1);
        }
        else{
            console.error(`Fetch failed after ${retries} retries: ${error}`);
            return "请求失败";
        }
    }
}
fetchWithRetry('https://jsonplaceholder.typicode.com/posts/1', 3)
  .then(console.log);




const time=interval(1000);
time.subscribe(num=>console.log(num));


const promise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("Promise is resolved");
    },2000);
});
promise
.then(result=>console.log(result))
.catch(error=>console.log(error));