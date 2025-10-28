function PricingSection() {
    return (
        <section className="pricing-section">
            <h2>料金プラン</h2>

            <div className="pricing-cards">
                <div className="pricing-card">
                    <h3>無料</h3>
                    <p className="price">¥0</p>
                    <ul>
                        <li>基本機能</li>
                        <li>1プロジェクト</li>
                        <li>サポートなし</li>
                    </ul>
                    <button>始める</button>
                </div>

                <div className="pricing-card">
                    <h3>プロ</h3>
                    <p className="price">¥1,000</p>
                    <ul>
                        <li>すべての機能</li>
                        <li>無制限プロジェクト</li>
                        <li>優先サポート</li>
                    </ul>
                    <button>選択する</button>
                </div>
            </div>
        </section>
    )
}

export default PricingSection