document.querySelectorAll('#user-list tr').forEach((el) => {
    el.addEventListener('click', function () {
        const id = el.querySelector('td').textContent;
        getComment(id);
    });
});
//사용자 로딩
async function getUser() {
    const res = await axios.get('/users').catch((err) => console.log(err));
    const users = res.data;
    const tbody = document.querySelector('#user-list tbody');
    tbody.innerHTML = '';
    users.map(function (user) {
        const row = document.createElement('tr');
        row.addEventListener('click', () => {
            getComment(user.id);
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
    const res = await axios.get(`/users/${id}/comments`).catch((err) => console.log(err));
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

        const edit = document.createElement('button');
        edit.textContent = '수정';
        edit.addEventListener('click', async () => {
            alert('해당 댓글을 수정하시려면 로그인을 하셔야 합니다');
            location.href = `/login`;
        });

        const remove = document.createElement('button');
        remove.textContent = '삭제';
        remove.addEventListener('click', async () => {
            alert('해당 댓글을 삭제하시려면 로그인을 하셔야 합니다');
            location.href = `/login`;
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
    const name = e.target.name.value;
    const age = e.target.age.value;
    const married = e.target.married.checked;

    if (!loginId) {
        return alert('아이디를 입력하세요');
    }
    if (!pw) {
        return alert('비밀번호를 입력하세요');
    }
    if (!name) {
        return alert('이름을 입력하세요');
    }
    if (!age) {
        return alert('나이를 입력하세요');
    }

    await axios.post('/users', { loginId, pw, name, age, married }).catch((err) => console.error(err));
    location.href = `/login`;
    getUser();//사용자 로딩

    //초기화
    e.target.loginId.value = '';
    e.target.pw.value = '';
    e.target.username.value = '';
    e.target.age.value = '';
    e.target.married.checked = false;
});

