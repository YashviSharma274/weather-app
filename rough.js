const API_KEY = '8P34NJHN47NGLMWM64C879CZ3';
let content = document.querySelector('p');
async function show(){
    let location = 'London';
    let date1 = '2020-10-01';
    let date2 = '2020-12-31';
    let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date1}/${date2}?key=${API_KEY}`)
    let data = await response.json();
    console.log(data);
}
show();






