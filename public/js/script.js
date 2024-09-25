const socket = io();
//check if browser supports geolocation
if (navigator.geolocation) {
    console.log("Geolocation supported");
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (err) => {
            console.error("Error in geolocation: ", err);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0, // to disable catching
            accuracy: { desired: 10, acceptable: 20 }
        }
    );

} else {
    console.log("Geolocation not supported");
}

//debug
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Created by Rugved'
}).addTo(map);

const markers={};

socket.on("recieve-location",(data)=>{
    const {id,latitude,longitude} = data;
    map.setView([latitude,longitude], 16);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnected" ,(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})

