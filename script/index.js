const img = document.querySelector('img')
const tempSpan = document.querySelector('.temp span')
const descriptionP = document.querySelector('.description')
const locationP = document.querySelector('.location p')
const searchIcon = document.querySelector('#search-icon')
const input = document.querySelector('input')
const loadingDiv = document.querySelector('#loading')

function toCelcius(temp) {
    return (temp - 32) * 5/9
}

function setImage(cloudcover) {
    if (cloudcover <= 20) {
        img.src = '/images/cloudy.svg'
    } else if (cloudcover > 20 && cloudcover <= 40) {
        img.src = '/images/mostly_cloudy.svg'
    } else if (cloudcover > 40 && cloudcover <= 60) {
        img.src = '/images/partly_cloudy.svg'
    } else if (cloudcover > 60 && cloudcover <= 80) {
        img.src = '/images/mostly_sunny.svg'
    } else {
        img.src = '/images/sunny.svg'
    }
}

async function fetchData(location) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=3UXZSDYUTV9Q7VPR4Q9BNB5AD
`)
        const data = await response.json()
        const processedData = processData(data)
        console.log(processedData)
        setImage(toCelcius(processedData.temp))
        tempSpan.textContent = Math.ceil(toCelcius(processedData.temp))
        descriptionP.textContent = processedData.description
        locationP.textContent = processedData.city
    } catch(error) {
        console.error(error);
        loadingDiv.style.display = "none"
        input.value = ''
        alert(`There is an error, ${error}`)
    }
}

function processData(data) {
    return {
        city: data.address.charAt(0).toUpperCase() + data.address.slice(1),
        description: data.description,
        temp: data.days[0].temp,
        cloudcover: data.days[0].cloudcover
    }
}

searchIcon.addEventListener('click', async () => {
    loadingDiv.style.display = "block";
    if (!input.value) {
        alert('Please enter a location')
        loadingDiv.style.display = "none";
        return
    }
    await fetchData(input.value)
    input.value = ''
    loadingDiv.style.display = "none";
})

fetchData('Dar es Salaam')