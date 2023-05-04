import axios from "axios"
import uniqid from "uniqid"
import DomParser from "dom-parser"
import { readFileSync, writeFile, writeFileSync } from "fs"
// ;(async () => {
//   const allPage = "http://www.supernaturalwiki.com/Category:Characters"
//   const { data } = await axios.get(allPage)
//   let names = [
//     ...new DomParser()
//       .parseFromString(data)
//       .getElementById("mw-pages")
//       .getElementsByClassName("mw-category")[0]
//       .getElementsByTagName("a"),
//   ].map((el) =>
//     el.innerHTML
//       .replaceAll(" ", "_")
//       .replaceAll("&amp;", "%26")
//       .replaceAll("&#039;", "%27")
//   )
//   const allpgs = []
//   for (const name of names) {
//     const singleChar = `http://www.supernaturalwiki.com/${name}`
//     const { data } = await axios.get(singleChar)
//     const charTable = new DomParser()
//       .parseFromString(data)
//       .getElementsByTagName("table")[0]
//     const img = charTable?.getElementsByTagName("img")[0]
//       ? "http://www.supernaturalwiki.com" +
//         charTable
//           ?.getElementsByTagName("img")[0]
//           .attributes?.find((att) => att.name === "src")?.value
//       : "https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image.png"
//     const charName = name.replaceAll("_", " ")
//     const actor = getByTableName(charTable, "actor")
//     const episodes = getByTableNameSimple(charTable, "episode")?.filter(
//       (text) => text.includes(".")
//     )
//     const occupation = getByTableNameMixed(charTable, "occupation")
//     const char = { name: charName, actor, episodes, occupation, id: uniqid() }
//     allpgs.push(char)
//     console.log(char.name)
//   }
//   let alreadyThere = JSON.parse(readFileSync("./chars.json", "utf8"))
//   alreadyThere = [...alreadyThere, ...allpgs]
//   writeFile("./chars.json", JSON.stringify(alreadyThere), () => {})
// })()
// const getByTableName = (table, tn) => {
//   const index = table
//     ?.getElementsByTagName("td")
//     ?.findIndex((el) =>
//       el.innerHTML.toLowerCase().includes(`<b>${tn.toLowerCase()}</b>`)
//     )
//   if (index < 0) return []
//   return table
//     ?.getElementsByTagName("td")
//     [index + 1]?.getElementsByTagName("a")
//     .filter(
//       (el) =>
//         el.attributes.find((att) => att.name == "class")?.value ==
//         "external text"
//     )
//     .map((el) => el.innerHTML)
// }
// const getByTableNameSimple = (table, tn) => {
//   const index = table
//     ?.getElementsByTagName("td")
//     ?.findIndex((el) =>
//       el.innerHTML.toLowerCase().includes(`<b>${tn.toLowerCase()}</b>`)
//     )
//   if (index < 0) return []
//   return table
//     ?.getElementsByTagName("td")
//     [index + 1]?.getElementsByTagName("a")
//     .map((el) => el.innerHTML)
// }

// const getByTableNameMixed = (table, tn) => {
//   let linked = []
//   let plain = []
//   const index = table
//     ?.getElementsByTagName("td")
//     .findIndex((el) =>
//       el.innerHTML.toLowerCase().includes(`<b>${tn.toLowerCase()}</b>`)
//     )
//   if (index < 0) return []
//   linked = table
//     ?.getElementsByTagName("td")
//     [index + 1].getElementsByTagName("a")
//     .map((el) => el.innerHTML)
//   plain = table
//     ?.getElementsByTagName("td")
//     [index + 1].innerHTML.split("<br/>")
//     .filter(
//       (el) =>
//         !el.includes("<a href=") && !el.includes("\n") && !el.includes("<img")
//     )
//   return [...plain || [], ...linked || []]
// }

;(async () => {
  const main = "https://scatteredquotes.com/tv-shows/supernatural/"
  const res = await axios.get(
    "https://scatteredquotes.com/tv-shows/supernatural/"
  )

  const lastChunk = res.data.split('class="page-numbers"')[
    res.data.split('class="page-numbers"').length - 1
  ]
  const lastPageSplit = lastChunk.split("/supernatural/page/")[1].split("/")[0]
  const pages = [main]
  for (let i = 2; i <= lastPageSplit; i++) {
    pages.push(`${main}page/${i}`)
  }
  // var parser = new DOMParser();
  // try {
  // 	parser.parseFromString('x', 'text/html');
  // } catch(err) {
  // 	return false;
  // }
  for (const page of pages) {
    let { data } = await axios.get(page)
    let doc = new DomParser().parseFromString(data)
    let singleQuote = {}
    let quotes = doc.getElementsByClassName("post-quote")
    let jsonQuotes = []
    for (const q of quotes) {
      let lines = new DomParser()
        .parseFromString(q.innerHTML)
        .getElementsByTagName("p")
      singleQuote = {}
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (!line.getElementsByTagName("strong")[0]) {
          continue
        }
        let character = line.getElementsByTagName("strong")[0].innerHTML.replaceAll(":", "").replaceAll("<em>", "").replaceAll("</em>", "")
        let quote = line.innerHTML.split("</strong>")[1].replaceAll(":", "").replaceAll("<em>", "").replaceAll("</em>", "")
        singleQuote[`line_${i}`] = { character, quote }
      }
      jsonQuotes.push({...singleQuote, id: uniqid()})
    }
    let alreadyThere = JSON.parse(readFileSync("./quotes.json", "utf8"))
    console.log("done with page")
    alreadyThere = [...alreadyThere, ...jsonQuotes]
    writeFile("./quotes.json", JSON.stringify(alreadyThere), ()=>{})
  }
})()
