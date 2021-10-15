const { default: axios } = require("axios");

document.querySelectorAll('#user-list tr').forEach((el) => {
    el.addEventListener('click', function () {
        const id = el.querySelector('td').textContent;
        console.log(id);
        getComment(id);
    });
});
//사용자 로딩
async function getUser() {
    const res = await axios.get('/users').catch((err) => console.error(err));
    const users = res.data;
    console.log(users);
    const tbody = document.querySelector('#user-list tbody');
    tbody.innerHTML = '';
    users.map(function (user) {
        const row = document.createElement('tr');
        row.addEventListener('click', () => {
            getComment(user.loginId);
        });
        let td = document.createElement('td');
        td.textContent = user.id;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.loginId;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.name;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.age;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.married ? '기혼' : '미혼';//표현하기 위함
        row.appendChild(td);
        tbody.appendChild(row);//줄 자체를 추가
    });
}
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
        td.textContent = comment.User.name;//작성자
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = comment.comment;//댓글
        row.appendChild(td);

        const edit = document.createElement('button');
        edit.textContent = '수정';
        edit.addEventListener('click', async () => {
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
            await axios.delete(`/comments/${comment.id}`).catch((err) => console.error(err));
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

document.getElementById('user-form').addEventListener('submit', async (e) => {
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

    if (login != undefined)
        await axios.get(`/test`, { loginId, pw }).catch((err) => console.error(err));
    else return alert('아이디 또는 비밀번호를 다시 확인해주세요.');

    location.href = `/test?loginId=${loginId}`;
    getUser();//사용자 로딩
    //초기화
    e.target.loginId.value = '';
    e.target.pw.value = '';
});

document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = e.target.userid.value;
    const comment = e.target.comment.value;

    if (!id) {//id가 존재하는지는 검증하지 않음
        return alert('아이디를 입력하세요');
    }
    if (!comment) {
        return alert('댓글을 입력하세요');
    }
    const user = await axios.get(`/${id}`);
    const loginId = user.data.loginId;
    const pw = user.data.pw;

    if (user != undefined) //아이디 존재 x
        await axios.get('/test', { loginId, pw }).catch((err) => console.error(err));
    else
        return alert('존재하지 않는 아이디입니다');

    await axios.post('/comments', { id, comment }).catch((err) => console.error(err));
    getComment(id);//댓글
    //초기화
    e.target.userid.value = '';
    e.target.comment.value = '';
});
