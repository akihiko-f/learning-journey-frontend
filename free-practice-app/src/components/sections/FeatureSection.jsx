import { useState } from "react"
import timerAppImage from "../../assets/timer-app.png"
import todoAppImage from "../../assets/todo-app.png"

function FeatureSection() {
    const products = [
        { name: "Simple Timer App", image: timerAppImage },
        { name: "ToDo App", image: todoAppImage}
    ]

    const [currentIndex, setCurrentIndex] = useState(0)

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? products.length - 1 : prevIndex - 1
        )
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === products.length - 1 ? 0 : prevIndex + 1
        )
    }
    return (
        <section className="feature-section">
            <h2>Products</h2>

            <div className="carousel">
                <button onClick={goToPrevious} className="carousel-btn">
                    &lt;
                </button>

                <div className="carousel-content">
                    <p>{products[currentIndex].name}</p>
                    <img src={products[currentIndex].image} alt={products[currentIndex].name} />
                </div>

                <button onClick={goToNext} className="carousel-btn">
                    &gt;
                </button>
            </div>
        </section>
    )
}

export default FeatureSection