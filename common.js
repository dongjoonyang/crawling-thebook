/**
 * =======================================
 * 설명 : 무료보기
 * 링크 : https://thebook.io/
 * =======================================
 */
(function () {
    // cors 우회 프록시 서버
    const proxyUrl = 'https://proxy.cors.sh/';
    // 수집 대상 url
    const theBookUrl = 'https://thebook.io/';
    // 딜레이
    const delayTime = 0.0000000001;
    // 수집한 데이터 저장
    const theBook = [];
    // 링크 깊이
    const depth = 1;
    // 책의 링크 가져오기
    let linkSlice = '';

    // 크롤링 함수
    async function crawl(theBookUrl){
        // 수집중인 URL
        console.log(`수집중 ${theBookUrl} ...`);

        const count = document.querySelector('#count');
        count.textContent = parseInt(count.textContent) + 1;

        const layer = document.querySelector('#layer');
        layer.classList.add('on');

        // URL에서 데이터를 가져옴
        const response = await fetch(`${proxyUrl}${theBookUrl}`, {
            headers: {
                'x-cors-api-key': 'temp_39e6d7a0e7b837ce66fe99b6307aa059',
                'Access-Control-Allow-Origin': 'https://dongjoonyang.github.io',
                'Access-Control-Allow-Credentials': 'true',
                'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Content-Type' : 'application/javascript; charset=utf-8',
            }
        });
        // 응답 정보를 문자열로 변환
        const htmlString = await response.text();

        // HTML 문자열을 파싱하여 DOM 객체 생성
        const parser = new DOMParser();
        const htmlDOM = parser.parseFromString(htmlString, 'text/html');
        
        // 링크 깊이가 0이면 함수 종료
        if (depth === 0) {
            return;
        }

        const links = htmlDOM.querySelectorAll('.mdl-card__title a');

            for (const link of links) {
                // href 속성이 없으면 건너뜀
                if (!link.hasAttribute('href')) {
                    continue;
                }
                // href 속성값 추출
                const href = link.getAttribute('href');
                // 동일 도메인에 있는 URL만 수집
                if (href.startsWith('https://thebook.io/')) {
                    // 링크 추출 후 딜레이 시간만큼 대기한 후 재귀적으로 호출
                    await new Promise(resolve => setTimeout(resolve, delayTime));
                    const nextUrl = new URL(href, theBookUrl).href;
                    // 링크 깊이가 0 이상인 경우에만 수집
                    if (depth > 0) {
                        await crawl(nextUrl, depth - 1);
                    }
                }
            }
        try {
            // 데이터 추출 151
            const title = htmlDOM.querySelector('.book-overview h2').textContent.replace(/^\s+|\s+$/gm, "");
            const h4 = htmlDOM.querySelector('.book-overview > div.h4') !== null ? '유료' : '무료';
            const src = htmlDOM.querySelector('.iaction > img').src;
            
            theBook.push({
                title,
                h4,
                src
            });
        } catch (error) {
            console.log(`error: ${error}`)
            return;
        }
    }

    // 실행
    crawl(theBookUrl, depth).then(() => {
        console.log('크롤링 완료');
        console.log(JSON.stringify(theBook, null, 2));
        console.log(theBook.length);

        // 책 수집 완료 후
        const numCount = parseInt(count.textContent);
        const closeBtn = document.querySelector('#close');
        const layer = document.querySelector('#layer');
        const toggleBtn = document.querySelector('#toggleBtn');
        const loadImg = document.querySelector('#loadImg');
        const loadTitle = document.querySelector('#loadTitle');

        if(theBook.length === numCount){
            closeBtn.classList.add('on');
        }

        if(closeBtn.classList.contains('on')){
            loadImg.src = './doodle.png';
            loadTitle.textContent = '책';

            closeBtn.addEventListener('click', (e) => {
                layer.classList.remove('on');
                toggleBtn.classList.add('on'); // 버튼
            });
        }

        const free = document.querySelector('#book');
        try {
            for(let i = 0; i <= theBook.length; i++){
                const li = document.createElement("li");
                const img = document.createElement("img");
                const a = document.createElement("a");
                const span = document.createElement("span");
                let titleNode = document.createTextNode(`${theBook[i].title}`);
                let h4Node = document.createTextNode(`[${theBook[i].h4}]`);

                // 경로
                const hrefSrc = theBook[i].src;
                const arSplitUrl = hrefSrc.split('/');
                const nArLength = arSplitUrl.length
                const arFileName = arSplitUrl[nArLength-1];
                const arSplitFileName = arFileName.split('.');
                const src = arSplitFileName[0].split('_');
                
                span.appendChild(h4Node);
                `${theBook[i].h4}` === '무료' ? li.className = 'free_item' : li.className = 'pay_item';
                `${theBook[i].h4}` === '무료' ? span.className = 'free' : span.className = 'pay';
                
                img.src = theBook[i].src;
                a.href = theBookUrl + src[1];
                a.setAttribute('target', '_blank');
                book.appendChild(li).appendChild(a).appendChild(img);
                book.appendChild(li).appendChild(titleNode);
                book.appendChild(li).appendChild(span);
            }    

        } catch (error) {
            console.log(`error: ${error}`)
            return;
        }
        
        
    }).catch(err => console.error(err));
})();

/**
 * =======================================
 * 설명 : 유료 전체 보기/숨기기
 * =======================================
 */
(function () {
    const toggleBtn = document.querySelector('#toggleBtn');
    let flag = true;
    toggleBtn.addEventListener('click', (event) => {
        const payViews = document.querySelectorAll('.pay_item');
        if(flag){
            toggleBtn.textContent = '전체 보기';
            [].forEach.call(payViews, function(payView){ 
                payView.style.display = 'none';
            });
            flag = false;
        }else{
            toggleBtn.textContent = '무료 보기';
            [].forEach.call(payViews, function(payView){ 
                payView.style.display = '';
            });
            flag = true;
        }
    })
})();