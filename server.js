import { serve } from "https://deno.land/std@0.138.0/http/server.ts";

import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

const _chars = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわ';//'を','ん' を除く
let previousWord = "";
previousWord += _chars.charAt(Math.floor(Math.random() * _chars.length));
let WordList = [];
WordList.push(previousWord);

console.log("Listening on http://localhost:8000");

serve(async (req) => {
    const pathname = new URL(req.url).pathname;
    console.log(pathname);

    if (req.method === "GET" && pathname === "/shiritori") {
        return new Response(previousWord);
        
    }
    
    if (req.method === "POST" && pathname === "/shiritori") {

        const requestJson = await req.json();
        let nextWord = requestJson.nextWord;

        if (nextWord.length > 0 && previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0) && nextWord != "reset")
        {
          return new Response("前の単語に続いていません。", { status: 400 });
        }
      
        else if (WordList.includes(nextWord) == true)
        {
          return new Response("その単語はすでに使われています。", { status: 400 });
        }
        
        else if (nextWord.charAt(nextWord.length - 1) === "ん")
        {
          return new Response("単語の末尾が「ん」になっています。", { status: 400 });
        }
        else if (nextWord.match(/^[ぁ-んー　]+$/))
        {}
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
        return new Response(previousWord);
      }

    return serveDir(req, {
      fsRoot: "public",
      // push時に変更しないとdeployweb上でエラー
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
      });
});

// function _save() {
//   return WordList;
// }