window.onload = async () => {
    // await generateQuote()
  }
  const toggleLoading = () => {
    document.querySelector(".spinner-border").classList.toggle("d-none")
  }
  const activateTab = (ev) => {
    document
      .querySelectorAll(".list-group-item.option")
      .forEach((el) => el.classList.remove("active"))
    ev.target.classList.add("active")
  }
