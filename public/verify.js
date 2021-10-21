document.querySelectorAll('#user-list tr').forEach((el) => {
    el.addEventListener('click', function () {
        const id = el.querySelector('td').textContent;
        getComment(id);
    });
});
//댓글 로딩
/*
    axios 정리
    - 요청 객체에 URL이 있다.

*/
async function getComment(id) {
    const res = await axios.get(`/users/${id}/comments`).catch((err) => console.error(err));
    const comments = res.data;//배열형태로 반환
    const tbody = document.querySelector('#comment-list tbody');
    tbody.innerHTML = '';
    comments.map(function (comment) {//배열 내의 모든 요소 각각에 대해 새로운 배열을 반환
        const row = document.createElement('tr');
        let td = document.createElement('td');
        td.textContent = comment.id;//아이디
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = comment.User.loginId;//작성자
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = comment.User.name;//작성자
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = comment.comment;//댓글
        row.appendChild(td);
        var loginId = comment.User.loginId;
        const edit = document.createElement('button');
        edit.textContent = '수정';
        edit.addEventListener('click', async () => {
            console.log('click button', loginId);

            const refresh = await axios.get('/refresh', { params: { loginId: loginId } });
            if (refresh.data.loginId != loginId) {
                return alert('수정할 권한이 없습니다.');
            }
            const newComment = prompt('바꿀 내용을 입력하세요');
            if (!newComment) {
                return alert('내용을 반드시 입력하셔야 합니다.');
            }
            await axios.patch(`/comments/${comment.id}`, { comment: newComment }).catch((err) => console.error(err));
            getComment(id);
        });

        const remove = document.createElement('button');
        remove.textContent = '삭제';
        remove.addEventListener('click', async () => {
            const refresh = await axios.get('/refresh', { params: { loginId: loginId } });
            if (refresh.data.loginId != loginId) {
                return alert('삭제할 권한이 없습니다.');
            }
            await axios.delete(`/comments/${comment.id}`).catch((err) => console.error(err));;
            getComment(id);
        });

        td = document.createElement('td');
        td.appendChild(edit);
        row.appendChild(td);//수정 추가
        td = document.createElement('td');
        td.appendChild(remove);
        row.appendChild(td);//삭제 추가
        tbody.appendChild(row);//줄 전체 추가
    });
}

function getURLParams(url) {
    var result = {};
    url.replace(/[?&]{1}([^=&#]+)=([^&#]*)/g, function (s, k, v) { result[k] = decodeURIComponent(v); });
    return result;
}

document.getElementById('user-form').addEventListener('submit', async (e) => {//회원탈퇴
    e.preventDefault();
    const loginId = e.target.loginId.value;
    const pw = e.target.pw.value;
    if (!loginId) {
        return alert('아이디를 입력하세요');
    }
    if (!pw) {
        return alert('비밀번호를 입력하세요');
    }
    var login = await axios.post(`/token`, { loginId, pw }).catch((err, res, req) => console.error(err));
    console.log(login);
    if (login != undefined)
        await axios.get('/test', { loginId, pw }).catch((err) => console.error(err));
    else return alert('아이디 또는 비밀번호를 다시 확인해주세요.');

    location.href = `/test?loginId=${loginId}`;
    getUser();//사용자 로딩
    //초기화
    e.target.loginId.value = '';
    e.target.pw.value = '';
});

document.getElementById('userid').value = getURLParams(location.search)[Object.keys(getURLParams(location.search))[0]];

document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const loginId = e.target.userid.value;//로그인아이디
    const comment = e.target.comment.value;
    if (!comment) {
        return alert('댓글을 입력하세요');
    }
    const user = await axios.get(`/login/${loginId}`);
    if (user.data != null) { //아이디 존재
        const pw = user.data.pw;
        await axios.get('/test', { params: { loginId: loginId, pw: pw } }).catch((err) => console.error(err));
    } else
        return alert('존재하지 않는 아이디입니다');
    const id = user.data.id;
    await axios.post('/comments', { id, comment }).catch((err) => console.error(err));
    getComment(id);//댓글
    //초기화
    e.target.userid.value = '';
    e.target.comment.value = '';
});
