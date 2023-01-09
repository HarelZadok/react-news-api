import {useState} from "react";


export default function Test() {
    const [res, setRes] = useState('');
    const apiKey = '30753d4629dd4e789ff615d8d8ed4296';
    const query = 'Horses'
    const sinceDate = '2022-12-09';
    const sort = 'popularity';
    const lang = 'en';

    const url = `https://newsapi.org/v2/everything?` +
        `q=${query}&` +
        `from=${sinceDate}&` +
        `sortBy=${sort}&` +
        `apiKey=${apiKey}&` +
        `language=${lang}`;

    const req = new Request(url);

    fetch(req)
        .then(function(response) {
            response.json().then(data => {
                setRes(data.articles[0].author);
            })
        })

    return <div>
        <p>{res}</p>
    </div>
}