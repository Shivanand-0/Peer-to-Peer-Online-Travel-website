  // Wait until map API is loaded
  function mappelMap() {
    // Create map
    const map = new mappls.Map('map', {
      center: [coordinate[0], coordinate[1]], // Delhi coordinates
      zoom: 10
    });

    // Add marker
    const marker = new mappls.Marker({
      map: map,
      position: [coordinate[0], coordinate[1]], // Marker position
      title: title,
      popupHtml: `<b>${title}</b><br><img src="${img}" alt="listing-img">`
    });
  };
  
  mappelMap();
