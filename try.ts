type lineNum = string
interface Quote {
    id: string
    [key: `line_${lineNum}`]: { //each quote can have an x amount of "line_y" properties.
        character: {
            name: string
            id: string
        }
        quote: string
    }
} 