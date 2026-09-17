const form = document.getElementById('reviewForm');
const comment = document.getElementById('comment');
const counter = document.getElementById('counter');
const ratingError = document.getElementById('ratingError');
const commentError = document.getElementById('commentError');
const status = document.getElementById('formStatus');

function updateCounter() {
    counter.textContent = `${comment.value.length} / 300`;
}

comment.addEventListener('input', updateCounter);

form.addEventListener('submit', function (event) {
    event.preventDefault();
    ratingError.textContent = '';
    commentError.textContent = '';
    status.textContent = '';

    const rating = form.querySelector('input[name="rating"]:checked');
    const text = comment.value.trim();
    let valid = true;

    if (!rating) {
        ratingError.textContent = '満足度を選択してください。';
        valid = false;
    }
    if (!text) {
        commentError.textContent = 'レビュー本文を入力してください。';
        valid = false;
    } else if (text.length < 10) {
        commentError.textContent = '10文字以上で入力してください。';
        valid = false;
    }
    if (!valid) {
        (rating ? comment : form.querySelector('input[name="rating"]')).focus();
        return;
    }

    form.querySelectorAll('input, textarea, button').forEach(function (field) {
        field.disabled = true;
    });
    status.textContent = 'レビューを投稿しました。ご協力ありがとうございます。';
});
