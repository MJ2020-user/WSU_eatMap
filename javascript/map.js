const buttons = document.querySelectorAll(".restaurant-list");  // "restaurant-list" 클래스를 가진 모든 요소를 선택하여 buttons에 저장합니다.
const queryMap = document.querySelector("#map-container");  // id가 "map-container"인 요소를 선택하여 queryMap에 저장합니다.
const mapQuitBtn = document.querySelector("#map-quit");  // id가 "map-quit"인 요소를 선택하여 mapQuitBtn에 저장합니다.

// buttons의 각 요소에 대해 클릭 이벤트를 등록합니다.
for (const button of buttons) {
  button.addEventListener("click", function(event) {
    let restaurantPath = event.target.offsetParent;  // 클릭된 버튼의 부모 요소를 찾아 restaurantPath에 저장합니다.
    if (restaurantPath.classList.value !== "restaurant-list") { 
      restaurantPath = restaurantPath.offsetParent;  // restaurantPath의 클래스 값이 "restaurant-list"가 아닐 경우, 한 단계 더 위의 부모 요소를 찾아 저장합니다.
    }
    const restaurantName = restaurantPath.childNodes[5].childNodes[1].innerText;  // 레스토랑 이름을 추출하여 restaurantName에 저장합니다.
    const restaurantAddress = restaurantPath.attributes[1].value;  // 레스토랑 주소를 추출하여 restaurantAddress에 저장합니다.
    document.body.style.overflow = "hidden";  // body의 스타일의 overflow 속성을 "hidden"으로 설정하여 스크롤을 막습니다.
    queryMap.classList.remove("invisible");  // queryMap 요소에서 "invisible" 클래스를 제거하여 지도를 보여줍니다.
    geocoding(restaurantName, restaurantAddress);  // geocoding 함수를 호출하여 주소를 좌표로 변환하고 지도를 생성합니다.
  })
}

// 주소를 좌표로 변환하는 geocoding 함수입니다.
function geocoding(name, address) {
    var Addr_val = address;

    // 도로명 주소를 좌표 값으로 변환하는 Naver Maps API의 geocode 함수를 호출합니다.
    naver.maps.Service.geocode({
        query: Addr_val
    }, function(status, response) {
        if (status !== naver.maps.Service.Status.OK) {
            return alert('Something wrong!');  // 변환에 실패한 경우, 경고 메시지를 표시합니다.
        }

        var result = response.v2,  // 검색 결과의 컨테이너를 가져옵니다.
            items = result.addresses;  // 검색 결과의 배열을 가져옵니다.
            
        // 리턴 받은 좌표 값을 변수에 저장합니다.
        let x = parseFloat(items[0].x);  // 경도 값을 x 변수에 저장합니다.
        let y = parseFloat(items[0].y);  // 위도 값을 y 변수에 저장합니다.
        mapGenerator(name, String(y), String(x));  // mapGenerator 함수를 호출하여 지도를 생성합니다.
    })
}

// 지도를 생성하는 mapGenerator 함수입니다.
function mapGenerator(name, la, lo){
  var location = new naver.maps.LatLng(la,lo),  // 위도와 경도로 LatLng 객체를 생성합니다.
      map = new naver.maps.Map('map', {
          center: location,  // 맵의 중심을 location으로 설정합니다.
          zoom: 19  // 줌 레벨을 19로 설정합니다.
      }),
      marker = new naver.maps.Marker({
          map: map,
          position: location  // 마커의 위치를 location으로 설정합니다.
      });
  if (isMobile()) {
    var contentString = [
        '<div>',
        '   <h5>'+name+'</h5>',
        '</div>'
    ].join('');
  }
  else {
    var contentString = [
        '<div>',
        '   <h5>'+name+'</h5>',
        '   <a target="_blank" href="http://map.naver.com/search/대전광역시 동구 자양동 '+name+'" >세부 정보 확인하기</a>',
        '</div>'
    ].join('');
  }

  var infowindow = new naver.maps.InfoWindow({
    content: contentString,  // 정보 창의 내용을 contentString으로 설정합니다.
    backgroundColor: "#eee",  // 배경색을 "#eee"로 설정합니다.
    borderColor: "#A4A4A4",  // 테두리 색을 "#A4A4A4"로 설정합니다.
    borderWidth: 2,  // 테두리 너비를 2로 설정합니다.
    disableAnchor: true,  // 앵커를 비활성화합니다.
    pixelOffset: new naver.maps.Point(0, -10)  // 픽셀 오프셋을 설정합니다.
  });
  
  // 마커를 클릭할 때 정보 창을 엽니다.
  naver.maps.Event.addListener(marker, "click", function() {
      if (infowindow.getMap()) {
        infowindow.close();  // 정보 창이 열려있을 경우 닫습니다.
      } else {
        infowindow.open(map, marker);  // 정보 창을 엽니다.
      }
  });

  // mapQuitBtn을 클릭할 때 정보 창을 닫고 지도를 숨깁니다.
  mapQuitBtn.addEventListener("click", function() {
    if (infowindow.getMap()) {
      infowindow.close();  // 정보 창이 열려있을 경우 닫습니다.
    }
    queryMap.classList.add("invisible");  // queryMap 요소에 "invisible" 클래스를 추가하여 지도를 숨깁니다.
    document.body.style.overflow = "visible";  // body의 스타일의 overflow 속성을 "visible"로 설정하여 스크롤을 다시 허용합니다.
  });
}
