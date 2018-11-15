<template>
    <div id="bar-chart">
        <header>
            <div
                v-show="selectedPageNumber"
                class="enm-pageno">page {{ selectedPageNumber }}</div>
            <h2
                v-show="title"
                class="title is-spaced">{{ title }}</h2>
        </header>

        <svg
            width="572"
            height="190"/>

        <div
            v-show="isbn"
            class="enm-buttons">
            <a
                :disabled="selectedBarIndex === 0"
                href="#"
                class="button"
                title="View previous matched page in this book"
                @click="clickPrevious"
            >
                &lt; previous </a>
            <a
                :disabled="selectedBarIndex === barChartData.length - 1"
                href="#"
                class="button"
                title="View next matched page in this book"
                @click="clickNext"
            >
                next &gt;</a>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

export default {
    name  : 'BarChart',
    props : {
        isbn         : {
            type     : String,
            required : true,
            default  : null,
        },
        barChartData : {
            type     : Array,
            required : true,
            default  : function () {
                return null;
            },
        },
        title        : {
            type     : String,
            required : true,
            default  : null,
        },
    },
    data() {
        return {
            selectedBarIndex   : null,
            pageToBarIndexMap  : {},
            selectedPageNumber : null,
            tip                : null,
        };
    },
    watch: {
        barChartData( newBarChartData, oldBarChartData ) {
            this.pageToBarIndexMap = {};
            this.barChartData.forEach( ( matchedPage, index ) => {
                this.pageToBarIndexMap[ matchedPage.page ] = index;
            } );

            this.drawBarChart();
        },
        selectedPageNumber: ( newSelectedPageNumber, oldSelectedPageNumber ) => {
            d3.select( '.enm-page-active' )
                .classed( 'enm-page-active', false );
            d3.select( 'rect[ name = "' + newSelectedPageNumber + '" ]' )
                .classed( 'enm-page-active', true );

            this.selectedBarIndex =
                this.pageToBarIndexMap[ this.previewPane.pageNumberForDisplay ];
        },
    },
    mounted() {
        this.tip = d3Tip()
            .attr( 'class', 'd3-tip' )
            .offset( [ -10, 0 ] )
            .html( function ( d ) {
                return 'Page: ' + d.page +
                       '<br>' +
                       '<span class="tooltip-score">' +
                       'Score: ' + d.score +
                       '</span>';
            } );

        d3.select( 'svg' ).call( this.tip );
    },
    methods: {
        clearBarChart() {
            d3.selectAll( 'svg > *' ).remove();
        },
        clickNext() {
            // Next button should disable itself automatically if on last matched page, but just in case, disable
            // here, too.
            if ( this.selectedBarIndex === this.barChartData.length - 1 ) {
                return;
            }

            this.triggerClickPage( this.selectedBarIndex + 1 );
        },
        clickPrevious() {
            // Previous button should disable itself automatically if on first matched page, but just in case, disable
            // here, too.
            if ( this.selectedBarIndex === 0 ) {
                return;
            }

            this.triggerClickPage( this.selectedBarIndex - 1 );
        },
        drawBarChart() {
            this.clearBarChart();

            // Based on https://bl.ocks.org/mbostock/3885304, with tooltips added using
            // https://github.com/Caged/d3-tip.

            const svg   = d3.select( 'svg' );
            const width = svg.attr( 'width' );
            const height = svg.attr( 'height' );

            const x = d3.scaleBand().rangeRound( [ 0, width ] ).padding( 0.1 );
            const y = d3.scaleLinear().rangeRound( [ height, 0 ] );

            const g = svg.append( 'g' );

            x.domain( this.barChartData.map( function ( d ) {
                return d.page;
            } ) );
            y.domain(
                [
                    0,
                    d3.max( this.barChartData, ( d ) => {
                        return d.score;
                    } ),
                ] );

            g.selectAll( '.bar' )
                .data( this.barChartData )
                .enter().append( 'rect' )
                .attr( 'class', 'bar' )
                .attr( 'name', ( d ) => {
                    return d.page;
                } )
                .attr( 'x', ( d ) => {
                    return x( d.page );
                } )
                .attr( 'y', function ( d ) {
                    return y( d.score );
                } )
                .attr( 'width', x.bandwidth() )
                .attr( 'height', function ( d ) {
                    return height - y( d.score );
                } )
                .attr( 'stroke', 'black' )
                .on( 'click', this.selectPage )
                .on( 'mouseover', this.tip.show )
                .on( 'mouseout', this.tip.hide );
        },
        selectPage( event ) {
            const page = event.page;

            this.selectedPageNumber = page;
            this.$emit( 'bar-click', page );
        },
        triggerClickPage: ( page ) => {
            let pageNameForDisplay;

            if ( typeof page === 'string' ) {
                pageNameForDisplay = page;
            } else if ( typeof page === 'number' ) {
                pageNameForDisplay = this.barChartData[ page ].page;
            }

            d3.select( 'rect[ name = "' + pageNameForDisplay + '" ]' )
                .dispatch( 'click' );
        },
    },
};
</script>

<style>
    .bar:hover {
        fill: grey;
    }

    .tooltip-score {
        font-size: 16px;
        margin-top: 15px;
    }

    /* Based on https://raw.githubusercontent.com/Caged/d3-tip/2de7071bb27fdd0a78b5208cb7d59f2988aaf10b/examples/example-styles.css */

    .d3-tip {
        line-height: 1;
        font-weight: bold;
        padding: 12px;
        background: #585858;
        color: white;
        border-radius: 2px;
        pointer-events: none;
    }

    /* Creates a small triangle extender for the tooltip */
    .d3-tip:after {
        box-sizing: border-box;
        display: inline;
        font-size: 10px;
        width: 100%;
        line-height: 1;
        color: rgba(0, 0, 0, 0.8);
        position: absolute;
        pointer-events: none;
    }

    /* Northward tooltips */
    .d3-tip.n:after {
        content: "\25BC";
        margin: -1px 0 0 0;
        top: 100%;
        left: 0;
        text-align: center;
    }

    /* Eastward tooltips */
    .d3-tip.e:after {
        content: "\25C0";
        margin: -4px 0 0 0;
        top: 50%;
        left: -8px;
    }

    /* Southward tooltips */
    .d3-tip.s:after {
        content: "\25B2";
        margin: 0 0 1px 0;
        top: -8px;
        left: 0;
        text-align: center;
    }

    /* Westward tooltips */
    .d3-tip.w:after {
        content: "\25B6";
        margin: -4px 0 0 -1px;
        top: 50%;
        left: 100%;
    }
</style>
