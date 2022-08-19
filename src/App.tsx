import React from 'react';
import logo from './logo.svg';
import './App.css';
import { editableInputTypes } from '@testing-library/user-event/dist/utils';
import { strict } from 'assert';
import { stringify } from 'querystring';

function App() {

let 이름 : string = '엘더';
let 나이 : number = 27;
let 출생지역 : string = '마산';

type 가수와노래 = { 제목 : string,
가수 : string};

let 내최애 : 가수와노래 = { 제목 : '좋은날', 가수 : '아이유'};

let 니최애 :{
  제목 : string,
  가수 : string
} = {
  제목 : '나쁜날',
  가수 : '어른유'
}

type projectType = {
  member : string[],
  days : number,
  started : boolean
}

let project : projectType = {
  member : ['kim', 'park'],
  days : 30,
  started : true
}

let user : string = 'kim';
let age : undefined | number = undefined;
let married : boolean = false;
// let 철수 : [string, undefined | number, boolean] = [user, age, married]; // 틀린답
let 철수 : (string | number | undefined | boolean)[] = [user, age, married];

let 학교 : {
  score : (number | boolean)[],
  teacher : string,
  friend : string | string[]
} = {
  score : [100,97,84],
  teacher : 'Phill',
  friend : 'John'
};

학교.score[4] = false;
학교.friend = ['Lee', 학교.teacher];

function 숙제1(이름 : string | undefined) :string{
   if(이름 === undefined){
    return '이름이 없습니다';
  }else {
    return 이름;
  }
}

function 숙제2(이름? :string) {
  if (이름) {
    console.log('안녕하세요'+이름+'님');
  } else {
    console.log('입력값이 없습니다');
  }
}

function 숙제3(x : number | string) :number {
  if(typeof x === 'number'){
    return x.toString().length;
  }
  else{
    return x.length;
  }
}

function 숙제4(x : {
  월소득 : number,
  집보유여부 : boolean,
  매력점수 : string
}) : string | undefined {
  let 총점: number = 0;
  if(x.집보유여부 === true){
    if(x.매력점수 == '상'){
       총점  = x.월소득+500+100;
    }else {
       총점 = x.월소득+500;
    }
  }else{
    if(x.매력점수 == '상'){
       총점  = x.월소득+100;
    }else {
       총점 = x.월소득;
    }
  }
  if(총점 >= 600){
    return '결혼가능'
  }
}
//이러헤 복잡하게 안해도 되겠네 그냥 if를 3번 쓰면 되네!

function 숙제5(월소득: number, 집보유여부: boolean, 매력점수: string) : string | undefined {
  let 총점: number = 월소득;
  if(집보유여부 === true){
    총점 += 500;
  }
  if(매력점수 === '상'){
    총점 += 100;
  }
  if(총점 >= 600){
    return '결혼가능'
  }
}





  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
