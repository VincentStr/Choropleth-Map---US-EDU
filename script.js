const countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
const educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"


const canvas = d3.select('#canvas')
const tooltip = d3.select("#tooltip")

const drawMap = () => {

    canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr("fill", (countyDataItem) => {
            let id = countyDataItem["id"]
            let county = educationData.find((item) => {
                return item["fips"] === id
            })
            let percentage = county["bachelorsOrHigher"]
            if (percentage <= 15) {
                return "rgb(155, 163, 235)"
            }
            if (percentage <= 30) {
                return "rgb(100, 111, 212)"
            } else if (percentage <= 45) {
                return "rgb(76, 53, 117)"
            } else {
                return "rgb(55, 27, 88)"
            }
        })
        .attr("data-fips", (countyDataItem) => {
            return countyDataItem["id"]
        })
        .attr("data-education", (countyDataItem) => {
            let id = countyDataItem["id"]
            let county = educationData.find((item) => {
                return item["fips"] === id
            })
            let percentage = county["bachelorsOrHigher"]
            return percentage
        })
        .on("mouseover", (countyDataItem) => {
            tooltip.transition().style("visibility", "visible")
            let id = countyDataItem["id"]
            let county = educationData.find((item) => {
                return item["fips"] === id
            })
            tooltip.text(county["fips"] + " - " + county["area_name"] + ", " +
                county["state"] + " : " + county["bachelorsOrHigher"] + "%")
            tooltip.attr("data-education", county["bachelorsOrHigher"])
        })
        .on("mouseout", (countyDataItem) => {
            tooltip.transition()
                .style("visibility", "hidden")
        })
}

d3.json(countyURL).then(
    (data, error) => {
        if (error) {
        } else {
            countyData = topojson.feature(data, data.objects.counties).features
            d3.json(educationURL).then(
                (data, error) => {
                    if (error) {

                    } else {
                        educationData = data

                        drawMap()
                    }
                }
            )
        }
    }
)