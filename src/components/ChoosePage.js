import './ChoosePage.css'
import {useRef, useState} from "react";

export default function ChoosePage() {
    const apiKey = 'e1f23e61a4e94787ad3376684e8cf097';
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [image, setImage] = useState('');
    const [query, setQuery] = useState('');
    const [index, setIndex] = useState(0);
    const leftArrow = useRef(null);

    return <div className={'container'}>
        <div className={'form'}>
            <small className={'label'}>Subject:</small>
            <input onChange={event => setQuery(event.target.value)} className={'input'} type="text"/>
        </div>
        <div className={'form'}>
            <small className={'label'}>Difficulty:</small>
            <div style={{width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                        <input type={'radio'} id={'easy'} name={'difficulty'} value={'easy'}/>
                        <label htmlFor={'easy'}>Easy</label>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                        <input type={'radio'} id={'hard'} name={'difficulty'} value={'hard'}/>
                        <label htmlFor={'hard'}>Hard</label>
                    </div>
                </div>
            </div>
        </div>
        <button onClick={() => handleSubmit(query, apiKey, setContent, setTitle, setAuthor, setImage)}>Submit</button>
        <img src={image} alt={'article'}/>
        <p>{title}</p>
        <p>{content}</p>
        <p>{author}</p>

        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '10vw'}}>
            <button ref={leftArrow} onClick={() => {
                const temp = index - 1;
                if (temp <= 0)
                {
                    leftArrow.current.disabled = true;
                }
                loadArticle(query, apiKey, setContent, setTitle, setAuthor, setImage, temp);
                setIndex(temp);
            }}>{'<'}</button>
            <small>{index}</small>
            <button onClick={() => {
                const temp = index + 1;
                if (temp > 0)
                {
                    leftArrow.current.disabled = false;
                }
                loadArticle(query, apiKey, setContent, setTitle, setAuthor, setImage, temp);
                setIndex(temp);
            }}>{'>'}</button>
        </div>
    </div>
}

const handleSubmit = (query, apiKey, setContent, setTitle, setAuthor, setImage) => {
    loadArticle(query, apiKey, setContent, setTitle, setAuthor, setImage, 0);
};

const loadArticle = (query, apiKey, setContent, setTitle, setAuthor, setImage, index) => {
    const url = `https://newsapi.org/v2/everything?` +
        `q=${query}&` +
        `apiKey=${apiKey}`;

    const req = new Request(url);

    fetch(req)
        .then(function(response) {
            response.json().then(data => {
                setTitle(data.articles[index].title);
                setContent(data.articles[index].content);
                setAuthor(data.articles[index].author);
                setImage(data.articles[index].urlToImage);
            })
        })
};