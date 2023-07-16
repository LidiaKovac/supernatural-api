export const paginate = (arr, pag, size = 10) => {
  //pag. 1 start= 0 end= 10
  //pag. 2 start = 10 end = 20
  //pag. 3 start=20 end=30
  return arr.slice((pag - 1) * size, pag * size)
}

export const filter = (arr, query) => {
  return arr.filter((el) => {
    const characters = []

    for (const line in el) {
      if (Object.hasOwnProperty.call(el, line)) {
        if (line.includes("line_")) {
          const lineContent = el[line]
          characters.push(lineContent.character.name.toLowerCase())
        }
      }
    }

    return (
      (query.season ? el.episode.season === query.season : true) &&
      (query.ep ? el.episode.ep === query.ep : true) &&
      (query.char
        ? query.char
            .toLowerCase()
            .split(",")
            .every((el) => characters.includes(el))
        : true)
    )
  })
}

export const populate = (data, field, from) => {
  return data.map((quote) => {
    const populated = {
      ...quote,
      [field]: from.find((el) => quote.episodeId === el.id),
    }
    return populated
  })
}
