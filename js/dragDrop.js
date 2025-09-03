import PositionElements from './positionElements.js';

class DragDrop {
    constructor() {
        this.positionElements = new PositionElements();
        this.selected = null;
        this.points = { correct: 0, wrong: 0 };

        this.dragDropEvents();
        this.imageChange();
    }

    // ---------------------------
    // ÉVÉNEMENTS DRAG & DROP
    // ---------------------------
    dragDropEvents() {
        const { draggableDivs, puzzleDivs } = this.positionElements.elements;

        draggableDivs.forEach(draggableDiv => {
            draggableDiv.addEventListener('dragstart', (e) => this.onDragStart(e));
        });

        puzzleDivs.forEach((puzzleDiv, i) => {
            puzzleDiv.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
            puzzleDiv.addEventListener('drop', () => {
                puzzleDiv.classList.remove("active");
                this.onDrop(i);
            });
            puzzleDiv.addEventListener('dragenter', () => puzzleDiv.classList.add("active"));
            puzzleDiv.addEventListener('dragleave', () => puzzleDiv.classList.remove("active"));
        });
    }

    onDragStart(e) {
        this.selected = e.target;
    }

    onDrop(index) {
        const { puzzleDivs } = this.positionElements.elements;

        if (puzzleDivs[index].children.length === 0) {
            this.selected.style.top = '0';
            this.selected.style.left = '0';
            this.selected.style.border = 'none';
            puzzleDivs[index].append(this.selected);

            if (Number(this.selected.dataset.index) === index) {
                this.points.correct++;
                this.selected.classList.add("correct-piece");
            } else {
                this.points.wrong++;
                this.selected.classList.add("wrong-piece");
            }

            this.checkGameState();
        }
    }

    // ---------------------------
    // VÉRIFICATION ÉTAT DU JEU
    // ---------------------------
    checkGameState() {
        const { puzzleDivs, modal, modalText, modalBtn, cellsAmount } = this.positionElements.elements;

        // ✅ Victoire
        if (this.points.correct === cellsAmount) {
            this.showModal(
                modal,
                modalText,
                modalBtn,
                `<h2 class="victory-title">🎉 VICTOIRE ! 🎉</h2>
                 <p>Bravo, vous avez terminé le puzzle.</p>
                 <p>✅ Pièces correctes : <strong>${this.points.correct}</strong></p>
                 <p>❌ Erreurs : <strong>${this.points.wrong}</strong></p>`,
                "victory"
            );
            return;
        }

        // ❌ Défaite
        if (!puzzleDivs.some(div => !div.firstElementChild) && this.points.correct < cellsAmount) {
            this.showModal(
                modal,
                modalText,
                modalBtn,
                `<h2 class="defeat-title">😢 DÉFAITE 😢</h2>
                 <p>Le puzzle est terminé, mais certaines pièces ne sont pas à leur place.</p>
                 <p>✅ Pièces correctes : <strong>${this.points.correct}</strong></p>
                 <p>❌ Erreurs : <strong>${this.points.wrong}</strong></p>
                 <p>👉 Cliquez sur "Rejouer" pour recommencer.</p>`,
                "defeat"
            );
        }
    }

    // ---------------------------
    // AFFICHAGE DU MODAL
    // ---------------------------
    showModal(modal, textElement, modalBtn, message, state) {
        modal.style.opacity = "1";
        modal.style.visibility = "visible";

        if (textElement) {
            textElement.innerHTML = message; // ✅ permet d'injecter HTML stylé
            textElement.classList.add("modal-animate");
        }

        // ✅ Le bouton devient "Rejouer"
        modalBtn.textContent = "🔄 Rejouer";

        if (state === "victory") {
            modalBtn.className = "modal-btn victory-btn";
        } else {
            modalBtn.className = "modal-btn defeat-btn";
        }

        modalBtn.onclick = () => location.reload();
    }

    // ---------------------------
    // CHANGEMENT D'IMAGE
    // ---------------------------
    imageChange() {
        const { finalImg, inputFile, draggableDivs } = this.positionElements.elements;

        inputFile.addEventListener("change", () => {
            const url = URL.createObjectURL(inputFile.files[0]);

            finalImg.style.backgroundImage = `url(${url})`;
            draggableDivs.forEach(div => {
                div.style.backgroundImage = `url(${url})`;
            });

            this.points = { correct: 0, wrong: 0 };
        });
    }
}

export default DragDrop;
