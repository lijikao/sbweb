(function(){
    Vue.component('vc-daterange-selector', {
        template: `
        <div class="datetimeselector">
            <span class="datetimespan">{{locale.caption}}</span>
            <input class="datetimeinput" type="text" ref="daterangepicker">
            <button type="button" value="7">{{locale.days7}}</button>
            <button type="button" value="15">{{locale.days15}}</button>
            <button type="button" value="30">{{locale.days30}}</button>
        </div>
        `,
        props: ['locale'],
        data: function(){
            return {
                dateStart: null,
                dateEnd: null,
                $picker: null,
            }
        },
        mounted: function(){
            (function(thisvue, $picker){
                $picker.daterangepicker({
                            locale: {
                                format: 'DD/MM/YYYY'
                            }
                        })
                        .on('cancel.daterangepicker', function(){
                            thisvue.saveDateRange(null);
                        })
                        .on('apply.daterangepicker', function(ev, picker){
                            thisvue.saveDateRange(picker.startDate, picker.endDate);
                        });
      
                $('button[type="button"]', $(thisvue.$el)).on('click', function(ev){
                    let $clicked = $(ev.target);
                    let days = $clicked.val();
                    if (true === wna.IsNullOrUndefined(days)){
                        return;
                    }
                    let end = moment();
                    let start = moment().subtract(days, 'days');

                    
                    $picker.data('daterangepicker').setStartDate(start);
                    $picker.data('daterangepicker').setEndDate(end);
                    thisvue.saveDateRange(start, end);    
                });

                thisvue.$picker = $picker;

                $('button[type="button"][value="7"]').trigger('click'); //trigger initial daterange change event
            })(this, $(this.$refs.daterangepicker));
        },
        methods: {
            saveDateRange: function(start, end){
                let thisvue = this;
                end = (true === wna.IsNullOrEmpty(end)) ? start : end;
                if (true !== wna.IsNullOrEmpty(start)){
                    thisvue.dateStart = start;
                    thisvue.dateEnd = end;
                }else{
                    thisvue.dateStart = null;
                    thisvue.dateEnd = null;
                }

                $(thisvue.$el).fire('change', {start: start, end: end});
            }
        }
    });
})(); 