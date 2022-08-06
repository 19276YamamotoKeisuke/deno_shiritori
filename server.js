import { serve } from "https://deno.land/std@0.138.0/http/server.ts";

import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

const _chars = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわ';//'ん' を除く
const _komoji_checker = 'ぁぃぅぇぉっゃゅょゎ';
let previousWord = [];
previousWord += _chars.charAt(Math.floor(Math.random() * _chars.length));
let WordList = [];
WordList.push(previousWord);

console.log("Listening on http://localhost:8000");

serve(
  async (req) => {
    const pathname = new URL(req.url).pathname;
    console.log(pathname);

    if (req.method === "GET" && pathname === "/shiritori") {
      return new Response(WordList
      );
        
    }
    if (req.method === "POST" && pathname === "/shiritori") {

        const requestJson = await req.json();
        let nextWord = requestJson.nextWord;
        
      if (nextWord.charAt(nextWord.length - 1) === "ー") {
        nextWord = nextWord.slice(0, -1);
        console.log(nextWord);
      }
      
      //単語末尾の小文字を変換
      else if (nextWord.charAt(nextWord.length - 1) == "ぁ") {
        nextWord = nextWord.slice(0, -1);
        nextWord += "あ";
      }
      else if (nextWord.charAt(nextWord.length - 1) == "ぃ") {
        nextWord = nextWord.slice(0, -1);
        nextWord += "い";
      }
      else if (nextWord.charAt(nextWord.length - 1) == "ぅ") {
        nextWord = nextWord.slice(0, -1);
        nextWord += "う";
      }
      else if (nextWord.charAt(nextWord.length - 1) == "ぇ") {
        nextWord = nextWord.slice(0, -1);
        nextWord += "え";
      }
      else if (nextWord.charAt(nextWord.length - 1) == "ぉ") {
        nextWord = nextWord.slice(0, -1);
        nextWord += "お";
      }
      else if (nextWord.charAt(nextWord.length - 1) == "っ") {
        nextWord = nextWord.slice(0, -1);
        nextWord += "つ";
      }
      else if (nextWord.charAt(nextWord.length - 1) == "ゃ") {
        nextWord = nextWord.slice(0, -1);
        nextWord += "や";
      }
      else if (nextWord.charAt(nextWord.length - 1) == "ゅ") {
        nextWord = nextWord.slice(0, -1);
        nextWord += "ゆ";
      }
      else if (nextWord.charAt(nextWord.length - 1) == "ょ") {
        nextWord = nextWord.slice(0, -1);
        nextWord += "よ";
      }
      else if (nextWord.charAt(nextWord.length - 1) == "ゎ") {
        nextWord = nextWord.slice(0, -1);
        nextWord += "わ";
      }
        //ここまで


        if (nextWord.length > 0 && previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0) && nextWord != "reset")
        {
          return new Response("前の単語に続いていません。", { status: 400 });
        }
      
        else if (WordList.includes(nextWord) == true)
        {
          return new Response("その単語はすでに使われています。", { status: 400 });
        }
        
        // else if (nextWord.charAt(nextWord.length - 1) === "ん")
        // {
        //   return new Response("単語の末尾が「ん」になっています。", { status: 400 });
        // }
        else if (nextWord.match(/^[ぁ-んー　]+$/))
        {
          console.log('ひらがな確認');
        }
        else if (nextWord == "reset")
        {
          nextWord = "";
          nextWord += _chars.charAt(Math.floor(Math.random() * _chars.length));
          WordList.length = 0;
          // app.words_history
          // nextWordへランダムな単語を入力＝疑似的なリロード+WordListリセット
          // WordList.push("error")
          console.log(WordList)
        }  
        else {
          return new Response("ひらがな以外は入力できません。(空白含む)", { status: 400 });
        }
      
      WordList.push(nextWord);
      console.log(WordList);
        previousWord = nextWord;
      return new Response(WordList
      // [WordList.length - 1]
        // previousWord
      );
      }

    return serveDir(req, {
      fsRoot: "deno_shiritori/public",
      // push時に変更しないとdeployweb上でエラー
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    });
    
  });