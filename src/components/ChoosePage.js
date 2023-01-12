import './ChoosePage.css'
import * as WordDifficulty from './WordDifficulty';
import {useEffect, useState} from "react";

export default function ChoosePage() {
    const apiKey = 'e1f23e61a4e94787ad3376684e8cf097';
    const [content, setContent] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [image, setImage] = useState('');
    const [query, setQuery] = useState('');
    const [difficulty, setDifficulty] = useState(WordDifficulty.EASY);

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
                        <input onInput={e => setDifficulty(e.target.value)} type={'radio'} defaultChecked={true} id={'easy'} name={'difficulty'} value={'easy'}/>
                        <label htmlFor={'easy'}>Easy</label>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                        <input onInput={e => setDifficulty(e.target.value)} type={'radio'} id={'hard'} name={'difficulty'} value={'hard'}/>
                        <label htmlFor={'hard'}>Hard</label>
                    </div>
                </div>
            </div>
        </div>
        <button onClick={() => handleSubmit(query, apiKey, setContent, setTitle, setAuthor, setImage, difficulty)}>Submit</button>
        <img style={{height: 300, marginTop: 20}} src={image} alt={'article'}/>
        <p>{title}</p>
        <p>{content}</p>
        <p>{author}</p>
    </div>
}

const handleSubmit = (query, apiKey, setContent, setTitle, setAuthor, setImage, difficulty) => {
    loadArticle(query, apiKey, setContent, setTitle, setAuthor, setImage, difficulty);
};

const loadArticle = (query, apiKey, setContent, setTitle, setAuthor, setImage, difficulty) => {
    const url = `https://newsapi.org/v2/everything?` +
        `q=${query}&` +
        `apiKey=${apiKey}`;

    const minWordCount = 10;
    const maxWordCount = 1000;

    const req = new Request(url);

    fetch(req)
        .then(function(response) {
            response.json().then(data => {
                const articles = data.articles.filter(article => {
                    const wordCount = article.content.split(' ').length;
                    return wordCount >= minWordCount && wordCount <= maxWordCount;
                });

                let chosenArticle = articles[0];

                let wordCountMax = 0;

                articles.forEach(article => {
                    let wordCount = 0;

                    let words = article.content.split(' ');
                    words = [...new Set(words)];

                    switch (difficulty) {
                        case WordDifficulty.EASY:
                            words.forEach(word => {
                                if (WordDifficulty.easy.includes(word))
                                    wordCount++
                            });
                            break;
                        case WordDifficulty.HARD:
                            words.forEach(word => {
                                if (WordDifficulty.hard.includes(word))
                                    wordCount++
                            });
                            break;
                    }

                    if (wordCount > wordCountMax) {
                        wordCountMax = wordCount;
                        chosenArticle = article;
                    }
                });

                const words = chosenArticle.content.split(' ');
                for (let i = 0; i < words.length; i++) {
                    switch (difficulty) {
                        case WordDifficulty.EASY:
                            const res1 = WordDifficulty.easy.indexOf(words[i]);
                            if (res1 !== -1) {
                                const word = words[i];
                                const translatedWord = WordDifficulty.easy_hebrew[res1];
                                words[i] = <span><span onClick={e => e.currentTarget.innerText = WordDifficulty.easy.indexOf(e.currentTarget.innerText) !== -1 ? translatedWord : word} style={{backgroundColor: "yellow", cursor: 'help'}}>{word}</span> </span>
                            }
                            else
                                words[i] = words[i] + ' ';
                            break;
                        case WordDifficulty.HARD:
                            const res2 = WordDifficulty.hard.indexOf(words[i]);
                            if (res2 !== -1) {
                                const word = words[i];
                                const translatedWord = WordDifficulty.hard_hebrew[res2];
                                words[i] = <span><span onClick={e => e.currentTarget.innerText = WordDifficulty.hard.indexOf(e.currentTarget.innerText) !== -1 ? translatedWord : word} style={{backgroundColor: "yellow", cursor: 'help'}}>{word}</span> </span>
                            }
                            else
                                words[i] = words[i] + ' ';
                    }
                }

                setTitle(chosenArticle.title);
                setContent(words);
                setAuthor(chosenArticle.author);
                setImage(chosenArticle.urlToImage);
            })
        })
};