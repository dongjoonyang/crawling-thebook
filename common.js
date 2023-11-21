/**
 * =======================================
 * 설명 : 무료보기
 * 링크 : https://thebook.io/
 * =======================================
 */
(function () {
    // cors 우회 프록시 서버
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    // 수집 대상 url
    const theBookUrl = 'https://thebook.io/';
    // 딜레이
    const delayTime = 0;
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
        // URL에서 데이터를 가져옴
        const response = await fetch(proxyUrl + theBookUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
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

        try {
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
            return;
        }
    }

    // 실행
    crawl(theBookUrl, depth).then(() => {
        console.log('크롤링 완료');
        console.log(JSON.stringify(theBook, null, 2));
        console.log(theBook.length);
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
                `${theBook[i].h4}` === '무료' ? li.className = 'free' : li.className = 'pay';
                `${theBook[i].h4}` === '무료' ? span.className = 'free' : span.className = 'pay';
                
                img.src = theBook[i].src;
                a.href = theBookUrl + src[1];
                book.appendChild(li).appendChild(a).appendChild(img);
                book.appendChild(li).appendChild(titleNode);
                book.appendChild(li).appendChild(span);
            }    
        } catch (error) {
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
        const payView = document.querySelector('.pay');
        if(flag){
            toggleBtn.textContent = '무료만 보기';
            payView.classList.add('on');
            flag = false;
        }else{
            toggleBtn.textContent = '전체 보기';
            payView.classList.remove('on');
            flag = true;
        }
    })
})();