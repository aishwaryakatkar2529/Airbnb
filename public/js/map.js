

    
    // mapboxgl.accessToken = 'pk.eyJ1IjoiaXRzc2FyYW5oZXJlIiwiYSI6ImNsd3B3aDFybjFodTMyaXJ6cGQxeWdwYzcifQ.4HPJRlRvgTdHaXXTDQEWCg';
    // const map = new mapboxgl.Map({
    //     container: 'map',
    //     style: 'mapbox://styles/mapbox/streets-v11',
    //     center: [coordinates], // Longitude, Latitude
    //     zoom: 9
        
    // });
    // console.log(coordinates);

    // const marker = new mapboxgl.Marker()
    // .setLngLat([JSON.stringify(listing.geometry.coordinates)]) //Listing.geometry.coordinates
    // .addTo(map);


    // mapboxgl.accessToken = mapToken;
    //   const map = new mapboxgl.Map({
    //       container: 'map', // container ID
    //       style: 'mapbox://styles/mapbox/streets-v11',
    //       center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    //       zoom: 9, // starting zoom
    //   });

    // //   console.log(coordinates);

    //   const marker1 = new mapboxgl.Marker({color:'red'})
    //   .setLngLat(listing.geometry.coordinates)
    //   .setPopup(new mapboxgl.Popup({offset: 25})
    //   .setHTML(`<h4>${listing.location}</h4><p>Exact Loacation provided after booking</p>`))
    //   .addTo(map);


      document.addEventListener('DOMContentLoaded', function () {
        if (listing.geometry && listing.geometry.coordinates) {
            mapboxgl.accessToken = mapToken;
            const map = new mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/streets-v11', // map style
                center: listing.geometry.coordinates, // starting position [lng, lat]
                zoom: 9, // starting zoom
            });
    
            const marker = new mapboxgl.Marker({ color: 'red' })
                .setLngLat(listing.geometry.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`))
                .addTo(map);
        } else {
            console.error("Coordinates are missing for this listing.");
        }
    });
