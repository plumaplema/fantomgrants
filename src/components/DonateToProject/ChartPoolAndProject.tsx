import { Chart } from "react-google-charts";

export const options = {
    title: "Donation Distribution",
    is3D: true,
};

export function ChartPoolAndProject({ totalFunding, tax }: { totalFunding: number, tax: number }) {
    const fundPool = totalFunding * (tax / 100)

    console.log(totalFunding, tax, fundPool)
    const data = [
        ["Task", "Hours per Day"],
        ["To Project", totalFunding - fundPool],
        ["Funding Pool", fundPool],
    ];

    return (
        <Chart
            chartType="PieChart"
            data={data}
            options={options}
            width={"100%"}
            height={"200px"}
        />
    );
}
