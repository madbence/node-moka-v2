exports.dateFormatter=function(d, string, lang)
{
	switch(lang)
	{
		case 'hu':
		default:
			var months=['januar', 'februar', 'marcius', 'aprilis', 'majus', 'junius', 'julius', 'augusztus', 'szeptember', 'oktober', 'november', 'december'];
			var sMonths=['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'szep', 'okt', 'nov', 'dec'];
			var daySuffix=['je', 'a', 'a', 'e', 'e', 'a', 'e', 'a', 'e', 'e', 'e', 'e', 'a', 'e', 'e', 'a', 'e', 'a', 'e', 'a', 'e', 'e', 'a', 'e', 'e', 'a', 'e', 'a', 'e', 'a', 'e'];
			var monthInSuffix=['ban', 'ban', 'ban', 'ban', 'ban', 'ban', 'ban', 'ban', 'ben', 'ben', 'ben', 'ben'];
			var days=['vasarnap', 'hetfo', 'kedd', 'szerda', 'csutortok', 'pentek', 'szombat'];
	}
	return string.replace('%Y', d.getFullYear()).
		replace('%y', d.getFullYear()%100).
		replace('%m', ((d.getMonth()+1)<10?'0':'')+(d.getMonth()+1)).
		replace('%n', d.getMonth()+1).
		replace('%M', sMonths[d.getMonth()]).
		replace('%F', months[d.getMonth()]).
		replace('%d', (d.getDate()<10?'0':'')+d.getDate()).
		replace('%D', days[d.getDay()]).
		replace('%j', d.getDate()).
		replace('%l', days[d.getDay()]).
		replace('%S', daySuffix[d.getDate()-1]).
		replace('%a', d.getHours()<12?'am':'pm').
		replace('%A', d.getHours()<12?'AM':'PM').
		replace('%g', d.getHours()==0?12:d.getHours()>12?d.getHours()-12:d.getHours()).
		replace('%G', d.getHours()).
		replace('%h', (((d.getHours()!=0&&d.getHours()<10)||(d.getHours()>12&&d.getHours()-12<10))?'0':'')+(d.getHours()==0?12:d.getHours()>12?d.getHours()-12:d.getHours())).
		replace('%H', (d.getHours()<10?'0':'')+d.getHours()).
		replace('%i', (d.getMinutes()<10?'0':'')+d.getMinutes()).
		replace('%s', (d.getSeconds()<10?'0':'')+d.getSeconds());
}