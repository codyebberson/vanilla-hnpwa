
var root = document.getElementById('app');
var baseUrl = 'https://api.hnpwa.com/v0/';
var folder = '';
var item = 1;

function loadHash() {
    folder = 'news';
    item = 1;

    var hash = window.location.hash.replace('#', '');
    if (hash) {
        if (hash.indexOf('/') > 0) {
            var components = hash.split('/');
            folder = components[0];
            item = parseInt(components[1]);
        } else {
            folder = hash;
        }
    }

    request(baseUrl + folder + '/' + item + '.json', renderData);
}

function renderData(data) {
    if (Array.isArray(data)) {
        renderItems(data);
    } else {
        renderItem(data);
    }
    window.scrollTo(0, 0);
}

function renderItems(items) {
    var html = '<ol start="' + ((item - 1) * 30 + 1) + '">';

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        html += '<li>';
        html += '<a href="' + item.url + '">' + item.title + '</a>';
        html += '<div>' + item.points + ' points by ' + item.user;
        html += ' | ';
        html += '<a href="#item/' + item.id + '">' + item.comments_count + ' comments</a>';
        html += '</div>';
        html += '</li>';
    }

    html += '</ol>';

    if (item > 1) {
        html += '<a href="#' + folder + '/' + (item - 1) + '">Prev</a> ';
    }

    if (items.length >= 30) {
        html += '<a href="#' + folder + '/' + (item + 1) + '">Next</a>';
    }

    root.innerHTML = html;
}

function renderItem(item) {
    var html = '<div>';
    html += '<strong>' + item.title + '</strong>';
    html += '<div>' + item.points + ' points by ' + item.user;
    html += ' | ';
    html += '<a href="#item/' + item.id + '">' + item.comments_count + ' comments</a>';
    html += '</div>';
    html += renderComments(item.comments);
    html += '</div>';
    root.innerHTML = html;
}

function renderComments(comments) {
    var html = '<div>';

    for (var i = 0; i < comments.length; i++) {
        var comment = comments[i];
        html += '<hr>';
        html += '<div>';
        html += '<div>' + comment.user + ' ' + comment.time_ago + '</div>';
        html += '<div>' + comment.content + '</div>';
        if (comment.comments && comment.comments.length > 0) {
            html += '<blockquote>';
            html += renderComments(comment.comments);
            html += '</blockquote>';
        }
        html += '</div>';
    }

    html += '</div>';
    return html;
}

function request(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
            return;
        }
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(JSON.parse(xhr.responseText));
        } else {
            console.log('error', xhr);
        }
    };

    xhr.open('GET', url);
    xhr.send();
}

window.addEventListener('load', loadHash);
window.addEventListener('hashchange', loadHash);
