import Elements from './elements.js'

class PositionElements {
	constructor() {
		this.elements = new Elements()
		this.leftPositions = [0, 8, 16, 24, 32]
		this.topPositions = [0, 6, 12, 18]
		this.cells = document.querySelector('.cells')
		this.correctPositions = [] // positions correctes
		this.addDraggableDivs()
	}

	shuffle(array) {
		return [...array].sort(() => Math.random() - 0.5)
	}

	bgPositions() {
		return this.topPositions
			.map(topPosition => {
				return this.leftPositions.map(leftPosition => [topPosition, leftPosition])
			})
			.reduce((positions, items) => [...positions, ...items], [])
	}

	async randomImage() {
		const res = await fetch('https://picsum.photos/1920/1080')
		this.imageURL = res.url
	}

	async addDraggableDivs() {
		const { cells, draggableDivs, finalImg, loader, randomBtn } = this.elements

		loader.classList.add("active")
		await this.randomImage()
		loader.classList.remove("active")

		finalImg.style.backgroundImage = `url(${this.imageURL})`

		const bgPositions = this.bgPositions()
		this.correctPositions = bgPositions.map(([top, left]) => ({
			top, left
		}))

		const shuffledPositions = this.shuffle(bgPositions)

		// Vider la grille avant d’ajouter les morceaux
		cells.innerHTML = ""

		draggableDivs.forEach((div, i) => {
			div.classList.add("puzzle-piece")
			div.draggable = true
			div.dataset.index = i // identifiant unique

			// Image de fond
			div.style.backgroundImage = `url(${this.imageURL})`
			div.style.backgroundPosition = `-${bgPositions[i][1]}vw -${bgPositions[i][0]}vw`

			// Position mélangée
			div.style.left = `${shuffledPositions[i][1]}vw`
			div.style.top = `${shuffledPositions[i][0]}vw`

			this.makeDraggable(div, cells)
			cells.appendChild(div)
		})

		randomBtn.onclick = () => this.addDraggableDivs()
	}

	makeDraggable(div, container) {
		div.addEventListener("dragstart", e => {
			e.dataTransfer.setData("piece", div.dataset.index)
		})

		container.addEventListener("dragover", e => e.preventDefault())

		container.addEventListener("drop", e => {
			e.preventDefault()
			const draggedIndex = e.dataTransfer.getData("piece")
			const dragged = document.querySelector(`[data-index="${draggedIndex}"]`)
			if (dragged && e.target.classList.contains("puzzle-piece")) {
				// Échanger les positions
				const tempLeft = dragged.style.left
				const tempTop = dragged.style.top
				dragged.style.left = e.target.style.left
				dragged.style.top = e.target.style.top
				e.target.style.left = tempLeft
				e.target.style.top = tempTop

				this.checkWin()
			}
		})
	}

	checkWin() {
		const pieces = document.querySelectorAll(".puzzle-piece")
		let correct = 0

		pieces.forEach((piece, i) => {
			const { left, top } = this.correctPositions[i]
			if (
				piece.style.left === `${left}vw` &&
				piece.style.top === `${top}vw`
			) {
				correct++
			}
		})

		if (correct === pieces.length) {
			alert("Bravo 🎉 Puzzle terminé !")
		}
	}
}

export default PositionElements
