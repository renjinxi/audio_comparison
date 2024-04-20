(()=>{var t={189:t=>{var e=function(){this.Diff_Timeout=1,this.Diff_EditCost=4,this.Match_Threshold=.5,this.Match_Distance=1e3,this.Patch_DeleteThreshold=.5,this.Patch_Margin=4,this.Match_MaxBits=32},n=-1;e.Diff=function(t,e){return[t,e]},e.prototype.diff_main=function(t,n,r,i){void 0===i&&(i=this.Diff_Timeout<=0?Number.MAX_VALUE:(new Date).getTime()+1e3*this.Diff_Timeout);var s=i;if(null==t||null==n)throw new Error("Null input. (diff_main)");if(t==n)return t?[new e.Diff(0,t)]:[];void 0===r&&(r=!0);var a=r,h=this.diff_commonPrefix(t,n),f=t.substring(0,h);t=t.substring(h),n=n.substring(h),h=this.diff_commonSuffix(t,n);var l=t.substring(t.length-h);t=t.substring(0,t.length-h),n=n.substring(0,n.length-h);var o=this.diff_compute_(t,n,a,s);return f&&o.unshift(new e.Diff(0,f)),l&&o.push(new e.Diff(0,l)),this.diff_cleanupMerge(o),o},e.prototype.diff_compute_=function(t,r,i,s){var a;if(!t)return[new e.Diff(1,r)];if(!r)return[new e.Diff(n,t)];var h=t.length>r.length?t:r,f=t.length>r.length?r:t,l=h.indexOf(f);if(-1!=l)return a=[new e.Diff(1,h.substring(0,l)),new e.Diff(0,f),new e.Diff(1,h.substring(l+f.length))],t.length>r.length&&(a[0][0]=a[2][0]=n),a;if(1==f.length)return[new e.Diff(n,t),new e.Diff(1,r)];var o=this.diff_halfMatch_(t,r);if(o){var g=o[0],c=o[1],u=o[2],d=o[3],p=o[4],_=this.diff_main(g,u,i,s),m=this.diff_main(c,d,i,s);return _.concat([new e.Diff(0,p)],m)}return i&&t.length>100&&r.length>100?this.diff_lineMode_(t,r,s):this.diff_bisect_(t,r,s)},e.prototype.diff_lineMode_=function(t,r,i){var s=this.diff_linesToChars_(t,r);t=s.chars1,r=s.chars2;var a=s.lineArray,h=this.diff_main(t,r,!1,i);this.diff_charsToLines_(h,a),this.diff_cleanupSemantic(h),h.push(new e.Diff(0,""));for(var f=0,l=0,o=0,g="",c="";f<h.length;){switch(h[f][0]){case 1:o++,c+=h[f][1];break;case n:l++,g+=h[f][1];break;case 0:if(l>=1&&o>=1){h.splice(f-l-o,l+o),f=f-l-o;for(var u=this.diff_main(g,c,!1,i),d=u.length-1;d>=0;d--)h.splice(f,0,u[d]);f+=u.length}o=0,l=0,g="",c=""}f++}return h.pop(),h},e.prototype.diff_bisect_=function(t,r,i){for(var s=t.length,a=r.length,h=Math.ceil((s+a)/2),f=h,l=2*h,o=new Array(l),g=new Array(l),c=0;c<l;c++)o[c]=-1,g[c]=-1;o[f+1]=0,g[f+1]=0;for(var u=s-a,d=u%2!=0,p=0,_=0,m=0,v=0,b=0;b<h&&!((new Date).getTime()>i);b++){for(var w=-b+p;w<=b-_;w+=2){for(var x=f+w,y=(E=w==-b||w!=b&&o[x-1]<o[x+1]?o[x+1]:o[x-1]+1)-w;E<s&&y<a&&t.charAt(E)==r.charAt(y);)E++,y++;if(o[x]=E,E>s)_+=2;else if(y>a)p+=2;else if(d&&(A=f+u-w)>=0&&A<l&&-1!=g[A]&&E>=(D=s-g[A]))return this.diff_bisectSplit_(t,r,E,y,i)}for(var M=-b+m;M<=b-v;M+=2){for(var D,A=f+M,I=(D=M==-b||M!=b&&g[A-1]<g[A+1]?g[A+1]:g[A-1]+1)-M;D<s&&I<a&&t.charAt(s-D-1)==r.charAt(a-I-1);)D++,I++;if(g[A]=D,D>s)v+=2;else if(I>a)m+=2;else if(!d){var E;if((x=f+u-M)>=0&&x<l&&-1!=o[x])if(y=f+(E=o[x])-x,E>=(D=s-D))return this.diff_bisectSplit_(t,r,E,y,i)}}}return[new e.Diff(n,t),new e.Diff(1,r)]},e.prototype.diff_bisectSplit_=function(t,e,n,r,i){var s=t.substring(0,n),a=e.substring(0,r),h=t.substring(n),f=e.substring(r),l=this.diff_main(s,a,!1,i),o=this.diff_main(h,f,!1,i);return l.concat(o)},e.prototype.diff_linesToChars_=function(t,e){var n=[],r={};function i(t){for(var e="",i=0,a=-1,h=n.length;a<t.length-1;){-1==(a=t.indexOf("\n",i))&&(a=t.length-1);var f=t.substring(i,a+1);(r.hasOwnProperty?r.hasOwnProperty(f):void 0!==r[f])?e+=String.fromCharCode(r[f]):(h==s&&(f=t.substring(i),a=t.length),e+=String.fromCharCode(h),r[f]=h,n[h++]=f),i=a+1}return e}n[0]="";var s=4e4,a=i(t);return s=65535,{chars1:a,chars2:i(e),lineArray:n}},e.prototype.diff_charsToLines_=function(t,e){for(var n=0;n<t.length;n++){for(var r=t[n][1],i=[],s=0;s<r.length;s++)i[s]=e[r.charCodeAt(s)];t[n][1]=i.join("")}},e.prototype.diff_commonPrefix=function(t,e){if(!t||!e||t.charAt(0)!=e.charAt(0))return 0;for(var n=0,r=Math.min(t.length,e.length),i=r,s=0;n<i;)t.substring(s,i)==e.substring(s,i)?s=n=i:r=i,i=Math.floor((r-n)/2+n);return i},e.prototype.diff_commonSuffix=function(t,e){if(!t||!e||t.charAt(t.length-1)!=e.charAt(e.length-1))return 0;for(var n=0,r=Math.min(t.length,e.length),i=r,s=0;n<i;)t.substring(t.length-i,t.length-s)==e.substring(e.length-i,e.length-s)?s=n=i:r=i,i=Math.floor((r-n)/2+n);return i},e.prototype.diff_commonOverlap_=function(t,e){var n=t.length,r=e.length;if(0==n||0==r)return 0;n>r?t=t.substring(n-r):n<r&&(e=e.substring(0,n));var i=Math.min(n,r);if(t==e)return i;for(var s=0,a=1;;){var h=t.substring(i-a),f=e.indexOf(h);if(-1==f)return s;a+=f,0!=f&&t.substring(i-a)!=e.substring(0,a)||(s=a,a++)}},e.prototype.diff_halfMatch_=function(t,e){if(this.Diff_Timeout<=0)return null;var n=t.length>e.length?t:e,r=t.length>e.length?e:t;if(n.length<4||2*r.length<n.length)return null;var i=this;function s(t,e,n){for(var r,s,a,h,f=t.substring(n,n+Math.floor(t.length/4)),l=-1,o="";-1!=(l=e.indexOf(f,l+1));){var g=i.diff_commonPrefix(t.substring(n),e.substring(l)),c=i.diff_commonSuffix(t.substring(0,n),e.substring(0,l));o.length<c+g&&(o=e.substring(l-c,l)+e.substring(l,l+g),r=t.substring(0,n-c),s=t.substring(n+g),a=e.substring(0,l-c),h=e.substring(l+g))}return 2*o.length>=t.length?[r,s,a,h,o]:null}var a,h,f,l,o,g=s(n,r,Math.ceil(n.length/4)),c=s(n,r,Math.ceil(n.length/2));return g||c?(a=c?g&&g[4].length>c[4].length?g:c:g,t.length>e.length?(h=a[0],f=a[1],l=a[2],o=a[3]):(l=a[0],o=a[1],h=a[2],f=a[3]),[h,f,l,o,a[4]]):null},e.prototype.diff_cleanupSemantic=function(t){for(var r=!1,i=[],s=0,a=null,h=0,f=0,l=0,o=0,g=0;h<t.length;)0==t[h][0]?(i[s++]=h,f=o,l=g,o=0,g=0,a=t[h][1]):(1==t[h][0]?o+=t[h][1].length:g+=t[h][1].length,a&&a.length<=Math.max(f,l)&&a.length<=Math.max(o,g)&&(t.splice(i[s-1],0,new e.Diff(n,a)),t[i[s-1]+1][0]=1,s--,h=--s>0?i[s-1]:-1,f=0,l=0,o=0,g=0,a=null,r=!0)),h++;for(r&&this.diff_cleanupMerge(t),this.diff_cleanupSemanticLossless(t),h=1;h<t.length;){if(t[h-1][0]==n&&1==t[h][0]){var c=t[h-1][1],u=t[h][1],d=this.diff_commonOverlap_(c,u),p=this.diff_commonOverlap_(u,c);d>=p?(d>=c.length/2||d>=u.length/2)&&(t.splice(h,0,new e.Diff(0,u.substring(0,d))),t[h-1][1]=c.substring(0,c.length-d),t[h+1][1]=u.substring(d),h++):(p>=c.length/2||p>=u.length/2)&&(t.splice(h,0,new e.Diff(0,c.substring(0,p))),t[h-1][0]=1,t[h-1][1]=u.substring(0,u.length-p),t[h+1][0]=n,t[h+1][1]=c.substring(p),h++),h++}h++}},e.prototype.diff_cleanupSemanticLossless=function(t){function n(t,n){if(!t||!n)return 6;var r=t.charAt(t.length-1),i=n.charAt(0),s=r.match(e.nonAlphaNumericRegex_),a=i.match(e.nonAlphaNumericRegex_),h=s&&r.match(e.whitespaceRegex_),f=a&&i.match(e.whitespaceRegex_),l=h&&r.match(e.linebreakRegex_),o=f&&i.match(e.linebreakRegex_),g=l&&t.match(e.blanklineEndRegex_),c=o&&n.match(e.blanklineStartRegex_);return g||c?5:l||o?4:s&&!h&&f?3:h||f?2:s||a?1:0}for(var r=1;r<t.length-1;){if(0==t[r-1][0]&&0==t[r+1][0]){var i=t[r-1][1],s=t[r][1],a=t[r+1][1],h=this.diff_commonSuffix(i,s);if(h){var f=s.substring(s.length-h);i=i.substring(0,i.length-h),s=f+s.substring(0,s.length-h),a=f+a}for(var l=i,o=s,g=a,c=n(i,s)+n(s,a);s.charAt(0)===a.charAt(0);){i+=s.charAt(0),s=s.substring(1)+a.charAt(0),a=a.substring(1);var u=n(i,s)+n(s,a);u>=c&&(c=u,l=i,o=s,g=a)}t[r-1][1]!=l&&(l?t[r-1][1]=l:(t.splice(r-1,1),r--),t[r][1]=o,g?t[r+1][1]=g:(t.splice(r+1,1),r--))}r++}},e.nonAlphaNumericRegex_=/[^a-zA-Z0-9]/,e.whitespaceRegex_=/\s/,e.linebreakRegex_=/[\r\n]/,e.blanklineEndRegex_=/\n\r?\n$/,e.blanklineStartRegex_=/^\r?\n\r?\n/,e.prototype.diff_cleanupEfficiency=function(t){for(var r=!1,i=[],s=0,a=null,h=0,f=!1,l=!1,o=!1,g=!1;h<t.length;)0==t[h][0]?(t[h][1].length<this.Diff_EditCost&&(o||g)?(i[s++]=h,f=o,l=g,a=t[h][1]):(s=0,a=null),o=g=!1):(t[h][0]==n?g=!0:o=!0,a&&(f&&l&&o&&g||a.length<this.Diff_EditCost/2&&f+l+o+g==3)&&(t.splice(i[s-1],0,new e.Diff(n,a)),t[i[s-1]+1][0]=1,s--,a=null,f&&l?(o=g=!0,s=0):(h=--s>0?i[s-1]:-1,o=g=!1),r=!0)),h++;r&&this.diff_cleanupMerge(t)},e.prototype.diff_cleanupMerge=function(t){t.push(new e.Diff(0,""));for(var r,i=0,s=0,a=0,h="",f="";i<t.length;)switch(t[i][0]){case 1:a++,f+=t[i][1],i++;break;case n:s++,h+=t[i][1],i++;break;case 0:s+a>1?(0!==s&&0!==a&&(0!==(r=this.diff_commonPrefix(f,h))&&(i-s-a>0&&0==t[i-s-a-1][0]?t[i-s-a-1][1]+=f.substring(0,r):(t.splice(0,0,new e.Diff(0,f.substring(0,r))),i++),f=f.substring(r),h=h.substring(r)),0!==(r=this.diff_commonSuffix(f,h))&&(t[i][1]=f.substring(f.length-r)+t[i][1],f=f.substring(0,f.length-r),h=h.substring(0,h.length-r))),i-=s+a,t.splice(i,s+a),h.length&&(t.splice(i,0,new e.Diff(n,h)),i++),f.length&&(t.splice(i,0,new e.Diff(1,f)),i++),i++):0!==i&&0==t[i-1][0]?(t[i-1][1]+=t[i][1],t.splice(i,1)):i++,a=0,s=0,h="",f=""}""===t[t.length-1][1]&&t.pop();var l=!1;for(i=1;i<t.length-1;)0==t[i-1][0]&&0==t[i+1][0]&&(t[i][1].substring(t[i][1].length-t[i-1][1].length)==t[i-1][1]?(t[i][1]=t[i-1][1]+t[i][1].substring(0,t[i][1].length-t[i-1][1].length),t[i+1][1]=t[i-1][1]+t[i+1][1],t.splice(i-1,1),l=!0):t[i][1].substring(0,t[i+1][1].length)==t[i+1][1]&&(t[i-1][1]+=t[i+1][1],t[i][1]=t[i][1].substring(t[i+1][1].length)+t[i+1][1],t.splice(i+1,1),l=!0)),i++;l&&this.diff_cleanupMerge(t)},e.prototype.diff_xIndex=function(t,e){var r,i=0,s=0,a=0,h=0;for(r=0;r<t.length&&(1!==t[r][0]&&(i+=t[r][1].length),t[r][0]!==n&&(s+=t[r][1].length),!(i>e));r++)a=i,h=s;return t.length!=r&&t[r][0]===n?h:h+(e-a)},e.prototype.diff_prettyHtml=function(t){for(var e=[],r=/&/g,i=/</g,s=/>/g,a=/\n/g,h=0;h<t.length;h++){var f=t[h][0],l=t[h][1].replace(r,"&amp;").replace(i,"&lt;").replace(s,"&gt;").replace(a,"&para;<br>");switch(f){case 1:e[h]='<ins style="background:#e6ffe6;">'+l+"</ins>";break;case n:e[h]='<del style="background:#ffe6e6;">'+l+"</del>";break;case 0:e[h]="<span>"+l+"</span>"}}return e.join("")},e.prototype.diff_text1=function(t){for(var e=[],n=0;n<t.length;n++)1!==t[n][0]&&(e[n]=t[n][1]);return e.join("")},e.prototype.diff_text2=function(t){for(var e=[],r=0;r<t.length;r++)t[r][0]!==n&&(e[r]=t[r][1]);return e.join("")},e.prototype.diff_levenshtein=function(t){for(var e=0,r=0,i=0,s=0;s<t.length;s++){var a=t[s][0],h=t[s][1];switch(a){case 1:r+=h.length;break;case n:i+=h.length;break;case 0:e+=Math.max(r,i),r=0,i=0}}return e+Math.max(r,i)},e.prototype.diff_toDelta=function(t){for(var e=[],r=0;r<t.length;r++)switch(t[r][0]){case 1:e[r]="+"+encodeURI(t[r][1]);break;case n:e[r]="-"+t[r][1].length;break;case 0:e[r]="="+t[r][1].length}return e.join("\t").replace(/%20/g," ")},e.prototype.diff_fromDelta=function(t,r){for(var i=[],s=0,a=0,h=r.split(/\t/g),f=0;f<h.length;f++){var l=h[f].substring(1);switch(h[f].charAt(0)){case"+":try{i[s++]=new e.Diff(1,decodeURI(l))}catch(t){throw new Error("Illegal escape in diff_fromDelta: "+l)}break;case"-":case"=":var o=parseInt(l,10);if(isNaN(o)||o<0)throw new Error("Invalid number in diff_fromDelta: "+l);var g=t.substring(a,a+=o);"="==h[f].charAt(0)?i[s++]=new e.Diff(0,g):i[s++]=new e.Diff(n,g);break;default:if(h[f])throw new Error("Invalid diff operation in diff_fromDelta: "+h[f])}}if(a!=t.length)throw new Error("Delta length ("+a+") does not equal source text length ("+t.length+").");return i},e.prototype.match_main=function(t,e,n){if(null==t||null==e||null==n)throw new Error("Null input. (match_main)");return n=Math.max(0,Math.min(n,t.length)),t==e?0:t.length?t.substring(n,n+e.length)==e?n:this.match_bitap_(t,e,n):-1},e.prototype.match_bitap_=function(t,e,n){if(e.length>this.Match_MaxBits)throw new Error("Pattern too long for this browser.");var r=this.match_alphabet_(e),i=this;function s(t,r){var s=t/e.length,a=Math.abs(n-r);return i.Match_Distance?s+a/i.Match_Distance:a?1:s}var a=this.Match_Threshold,h=t.indexOf(e,n);-1!=h&&(a=Math.min(s(0,h),a),-1!=(h=t.lastIndexOf(e,n+e.length))&&(a=Math.min(s(0,h),a)));var f,l,o=1<<e.length-1;h=-1;for(var g,c=e.length+t.length,u=0;u<e.length;u++){for(f=0,l=c;f<l;)s(u,n+l)<=a?f=l:c=l,l=Math.floor((c-f)/2+f);c=l;var d=Math.max(1,n-l+1),p=Math.min(n+l,t.length)+e.length,_=Array(p+2);_[p+1]=(1<<u)-1;for(var m=p;m>=d;m--){var v=r[t.charAt(m-1)];if(_[m]=0===u?(_[m+1]<<1|1)&v:(_[m+1]<<1|1)&v|(g[m+1]|g[m])<<1|1|g[m+1],_[m]&o){var b=s(u,m-1);if(b<=a){if(a=b,!((h=m-1)>n))break;d=Math.max(1,2*n-h)}}}if(s(u+1,n)>a)break;g=_}return h},e.prototype.match_alphabet_=function(t){for(var e={},n=0;n<t.length;n++)e[t.charAt(n)]=0;for(n=0;n<t.length;n++)e[t.charAt(n)]|=1<<t.length-n-1;return e},e.prototype.patch_addContext_=function(t,n){if(0!=n.length){if(null===t.start2)throw Error("patch not initialized");for(var r=n.substring(t.start2,t.start2+t.length1),i=0;n.indexOf(r)!=n.lastIndexOf(r)&&r.length<this.Match_MaxBits-this.Patch_Margin-this.Patch_Margin;)i+=this.Patch_Margin,r=n.substring(t.start2-i,t.start2+t.length1+i);i+=this.Patch_Margin;var s=n.substring(t.start2-i,t.start2);s&&t.diffs.unshift(new e.Diff(0,s));var a=n.substring(t.start2+t.length1,t.start2+t.length1+i);a&&t.diffs.push(new e.Diff(0,a)),t.start1-=s.length,t.start2-=s.length,t.length1+=s.length+a.length,t.length2+=s.length+a.length}},e.prototype.patch_make=function(t,r,i){var s,a;if("string"==typeof t&&"string"==typeof r&&void 0===i)s=t,(a=this.diff_main(s,r,!0)).length>2&&(this.diff_cleanupSemantic(a),this.diff_cleanupEfficiency(a));else if(t&&"object"==typeof t&&void 0===r&&void 0===i)a=t,s=this.diff_text1(a);else if("string"==typeof t&&r&&"object"==typeof r&&void 0===i)s=t,a=r;else{if("string"!=typeof t||"string"!=typeof r||!i||"object"!=typeof i)throw new Error("Unknown call format to patch_make.");s=t,a=i}if(0===a.length)return[];for(var h=[],f=new e.patch_obj,l=0,o=0,g=0,c=s,u=s,d=0;d<a.length;d++){var p=a[d][0],_=a[d][1];switch(l||0===p||(f.start1=o,f.start2=g),p){case 1:f.diffs[l++]=a[d],f.length2+=_.length,u=u.substring(0,g)+_+u.substring(g);break;case n:f.length1+=_.length,f.diffs[l++]=a[d],u=u.substring(0,g)+u.substring(g+_.length);break;case 0:_.length<=2*this.Patch_Margin&&l&&a.length!=d+1?(f.diffs[l++]=a[d],f.length1+=_.length,f.length2+=_.length):_.length>=2*this.Patch_Margin&&l&&(this.patch_addContext_(f,c),h.push(f),f=new e.patch_obj,l=0,c=u,o=g)}1!==p&&(o+=_.length),p!==n&&(g+=_.length)}return l&&(this.patch_addContext_(f,c),h.push(f)),h},e.prototype.patch_deepCopy=function(t){for(var n=[],r=0;r<t.length;r++){var i=t[r],s=new e.patch_obj;s.diffs=[];for(var a=0;a<i.diffs.length;a++)s.diffs[a]=new e.Diff(i.diffs[a][0],i.diffs[a][1]);s.start1=i.start1,s.start2=i.start2,s.length1=i.length1,s.length2=i.length2,n[r]=s}return n},e.prototype.patch_apply=function(t,e){if(0==t.length)return[e,[]];t=this.patch_deepCopy(t);var r=this.patch_addPadding(t);e=r+e+r,this.patch_splitMax(t);for(var i=0,s=[],a=0;a<t.length;a++){var h,f,l=t[a].start2+i,o=this.diff_text1(t[a].diffs),g=-1;if(o.length>this.Match_MaxBits?-1!=(h=this.match_main(e,o.substring(0,this.Match_MaxBits),l))&&(-1==(g=this.match_main(e,o.substring(o.length-this.Match_MaxBits),l+o.length-this.Match_MaxBits))||h>=g)&&(h=-1):h=this.match_main(e,o,l),-1==h)s[a]=!1,i-=t[a].length2-t[a].length1;else if(s[a]=!0,i=h-l,o==(f=-1==g?e.substring(h,h+o.length):e.substring(h,g+this.Match_MaxBits)))e=e.substring(0,h)+this.diff_text2(t[a].diffs)+e.substring(h+o.length);else{var c=this.diff_main(o,f,!1);if(o.length>this.Match_MaxBits&&this.diff_levenshtein(c)/o.length>this.Patch_DeleteThreshold)s[a]=!1;else{this.diff_cleanupSemanticLossless(c);for(var u,d=0,p=0;p<t[a].diffs.length;p++){var _=t[a].diffs[p];0!==_[0]&&(u=this.diff_xIndex(c,d)),1===_[0]?e=e.substring(0,h+u)+_[1]+e.substring(h+u):_[0]===n&&(e=e.substring(0,h+u)+e.substring(h+this.diff_xIndex(c,d+_[1].length))),_[0]!==n&&(d+=_[1].length)}}}}return[e=e.substring(r.length,e.length-r.length),s]},e.prototype.patch_addPadding=function(t){for(var n=this.Patch_Margin,r="",i=1;i<=n;i++)r+=String.fromCharCode(i);for(i=0;i<t.length;i++)t[i].start1+=n,t[i].start2+=n;var s=t[0],a=s.diffs;if(0==a.length||0!=a[0][0])a.unshift(new e.Diff(0,r)),s.start1-=n,s.start2-=n,s.length1+=n,s.length2+=n;else if(n>a[0][1].length){var h=n-a[0][1].length;a[0][1]=r.substring(a[0][1].length)+a[0][1],s.start1-=h,s.start2-=h,s.length1+=h,s.length2+=h}return 0==(a=(s=t[t.length-1]).diffs).length||0!=a[a.length-1][0]?(a.push(new e.Diff(0,r)),s.length1+=n,s.length2+=n):n>a[a.length-1][1].length&&(h=n-a[a.length-1][1].length,a[a.length-1][1]+=r.substring(0,h),s.length1+=h,s.length2+=h),r},e.prototype.patch_splitMax=function(t){for(var r=this.Match_MaxBits,i=0;i<t.length;i++)if(!(t[i].length1<=r)){var s=t[i];t.splice(i--,1);for(var a=s.start1,h=s.start2,f="";0!==s.diffs.length;){var l=new e.patch_obj,o=!0;for(l.start1=a-f.length,l.start2=h-f.length,""!==f&&(l.length1=l.length2=f.length,l.diffs.push(new e.Diff(0,f)));0!==s.diffs.length&&l.length1<r-this.Patch_Margin;){var g=s.diffs[0][0],c=s.diffs[0][1];1===g?(l.length2+=c.length,h+=c.length,l.diffs.push(s.diffs.shift()),o=!1):g===n&&1==l.diffs.length&&0==l.diffs[0][0]&&c.length>2*r?(l.length1+=c.length,a+=c.length,o=!1,l.diffs.push(new e.Diff(g,c)),s.diffs.shift()):(c=c.substring(0,r-l.length1-this.Patch_Margin),l.length1+=c.length,a+=c.length,0===g?(l.length2+=c.length,h+=c.length):o=!1,l.diffs.push(new e.Diff(g,c)),c==s.diffs[0][1]?s.diffs.shift():s.diffs[0][1]=s.diffs[0][1].substring(c.length))}f=(f=this.diff_text2(l.diffs)).substring(f.length-this.Patch_Margin);var u=this.diff_text1(s.diffs).substring(0,this.Patch_Margin);""!==u&&(l.length1+=u.length,l.length2+=u.length,0!==l.diffs.length&&0===l.diffs[l.diffs.length-1][0]?l.diffs[l.diffs.length-1][1]+=u:l.diffs.push(new e.Diff(0,u))),o||t.splice(++i,0,l)}}},e.prototype.patch_toText=function(t){for(var e=[],n=0;n<t.length;n++)e[n]=t[n];return e.join("")},e.prototype.patch_fromText=function(t){var r=[];if(!t)return r;for(var i=t.split("\n"),s=0,a=/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;s<i.length;){var h=i[s].match(a);if(!h)throw new Error("Invalid patch string: "+i[s]);var f=new e.patch_obj;for(r.push(f),f.start1=parseInt(h[1],10),""===h[2]?(f.start1--,f.length1=1):"0"==h[2]?f.length1=0:(f.start1--,f.length1=parseInt(h[2],10)),f.start2=parseInt(h[3],10),""===h[4]?(f.start2--,f.length2=1):"0"==h[4]?f.length2=0:(f.start2--,f.length2=parseInt(h[4],10)),s++;s<i.length;){var l=i[s].charAt(0);try{var o=decodeURI(i[s].substring(1))}catch(t){throw new Error("Illegal escape in patch_fromText: "+o)}if("-"==l)f.diffs.push(new e.Diff(n,o));else if("+"==l)f.diffs.push(new e.Diff(1,o));else if(" "==l)f.diffs.push(new e.Diff(0,o));else{if("@"==l)break;if(""!==l)throw new Error('Invalid patch mode "'+l+'" in: '+o)}s++}}return r},(e.patch_obj=function(){this.diffs=[],this.start1=null,this.start2=null,this.length1=0,this.length2=0}).prototype.toString=function(){for(var t,e=["@@ -"+(0===this.length1?this.start1+",0":1==this.length1?this.start1+1:this.start1+1+","+this.length1)+" +"+(0===this.length2?this.start2+",0":1==this.length2?this.start2+1:this.start2+1+","+this.length2)+" @@\n"],r=0;r<this.diffs.length;r++){switch(this.diffs[r][0]){case 1:t="+";break;case n:t="-";break;case 0:t=" "}e[r+1]=t+encodeURI(this.diffs[r][1])+"\n"}return e.join("").replace(/%20/g," ")},t.exports=e,t.exports.diff_match_patch=e,t.exports.DIFF_DELETE=n,t.exports.DIFF_INSERT=1,t.exports.DIFF_EQUAL=0},630:(t,e,n)=>{var r;t=n.nmd(t),function(){"use strict";var i;try{i="undefined"!=typeof Intl&&void 0!==Intl.Collator?Intl.Collator("generic",{sensitivity:"base"}):null}catch(t){console.log("Collator could not be initialized and wouldn't be used")}var s=n(787),a=[],h=[],f={get:function(t,e,n){if(n&&i&&n.useCollator){var r,f,l,o,g,c,u=t.length,d=e.length;if(0===u)return d;if(0===d)return u;for(l=0;l<d;++l)a[l]=l,h[l]=e.charCodeAt(l);for(a[d]=d,l=0;l<u;++l){for(f=l+1,o=0;o<d;++o)r=f,c=0===i.compare(t.charAt(l),String.fromCharCode(h[o])),(f=a[o]+(c?0:1))>(g=r+1)&&(f=g),f>(g=a[o+1]+1)&&(f=g),a[o]=r;a[o]=f}return f}return s.distance(t,e)}};null!==n.amdD&&n.amdO?void 0===(r=function(){return f}.call(e,n,e,t))||(t.exports=r):null!==t&&void 0!==e&&t.exports===e?t.exports=f:"undefined"!=typeof self&&"function"==typeof self.postMessage&&"function"==typeof self.importScripts?self.Levenshtein=f:"undefined"!=typeof window&&null!==window&&(window.Levenshtein=f)}()},787:(t,e,n)=>{"use strict";n.r(e),n.d(e,{closest:()=>s,distance:()=>i});const r=new Uint32Array(65536),i=(t,e)=>{if(t.length<e.length){const n=e;e=t,t=n}return 0===e.length?t.length:t.length<=32?((t,e)=>{const n=t.length,i=e.length,s=1<<n-1;let a=-1,h=0,f=n,l=n;for(;l--;)r[t.charCodeAt(l)]|=1<<l;for(l=0;l<i;l++){let t=r[e.charCodeAt(l)];const n=t|h;t|=(t&a)+a^a,h|=~(t|a),a&=t,h&s&&f++,a&s&&f--,h=h<<1|1,a=a<<1|~(n|h),h&=n}for(l=n;l--;)r[t.charCodeAt(l)]=0;return f})(t,e):((t,e)=>{const n=e.length,i=t.length,s=[],a=[],h=Math.ceil(n/32),f=Math.ceil(i/32);for(let t=0;t<h;t++)a[t]=-1,s[t]=0;let l=0;for(;l<f-1;l++){let h=0,f=-1;const o=32*l,g=Math.min(32,i)+o;for(let e=o;e<g;e++)r[t.charCodeAt(e)]|=1<<e;for(let t=0;t<n;t++){const n=r[e.charCodeAt(t)],i=a[t/32|0]>>>t&1,l=s[t/32|0]>>>t&1,o=n|h,g=((n|l)&f)+f^f|n|l;let c=h|~(g|f),u=f&g;c>>>31^i&&(a[t/32|0]^=1<<t),u>>>31^l&&(s[t/32|0]^=1<<t),c=c<<1|i,u=u<<1|l,f=u|~(o|c),h=c&o}for(let e=o;e<g;e++)r[t.charCodeAt(e)]=0}let o=0,g=-1;const c=32*l,u=Math.min(32,i-c)+c;for(let e=c;e<u;e++)r[t.charCodeAt(e)]|=1<<e;let d=i;for(let t=0;t<n;t++){const n=r[e.charCodeAt(t)],h=a[t/32|0]>>>t&1,f=s[t/32|0]>>>t&1,l=n|o,c=((n|f)&g)+g^g|n|f;let u=o|~(c|g),p=g&c;d+=u>>>i-1&1,d-=p>>>i-1&1,u>>>31^h&&(a[t/32|0]^=1<<t),p>>>31^f&&(s[t/32|0]^=1<<t),u=u<<1|h,p=p<<1|f,g=p|~(l|u),o=u&l}for(let e=c;e<u;e++)r[t.charCodeAt(e)]=0;return d})(t,e)},s=(t,e)=>{let n=1/0,r=0;for(let s=0;s<e.length;s++){const a=i(t,e[s]);a<n&&(n=a,r=s)}return e[r]}}},e={};function n(r){var i=e[r];if(void 0!==i)return i.exports;var s=e[r]={id:r,loaded:!1,exports:{}};return t[r](s,s.exports,n),s.loaded=!0,s.exports}n.amdD=function(){throw new Error("define cannot be used indirect")},n.amdO={},n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),(()=>{"use strict";var t=n(630),e=n.n(t),r=n(189);const i=new(n.n(r)()),s=e().get("hello","hello");function a(t){return(t=t.replace(/[\r\n]+/g," ")).replace(/\s+/g," ")}console.log("Levenshtein distance:",s),window.levenshtein=e(),window.uploadedText=-1,document.getElementById("fileInput").addEventListener("change",(function(){var t=this.files[0];if(document.getElementById("selectedFileName").textContent=t?`File: ${t.name}`:"",t){var e=URL.createObjectURL(t),n=document.getElementById("audioPlayer");document.getElementById("audioSource").src=e,n.load(),n.play().catch((t=>console.error("Error playing audio:",t)))}})),document.getElementById("textInputFile").addEventListener("change",(function(){var t=this.files[0];if(document.getElementById("selectedTextFileName").textContent=t?`File: ${t.name}`:"",t){var e=new FileReader;e.onload=function(t){window.uploadedText=t.target.result,window.uploadedText=a(window.uploadedText),document.getElementById("accuracyDisplay").textContent="Accuracy: --%"},e.readAsText(t)}})),document.getElementById("textInput").addEventListener("input",(function(){var t=document.getElementById("textInput");if(t.style.height="auto",t.style.height=t.scrollHeight+"px",-1==window.uploadedText)return void(document.getElementById("accuracyDisplay").textContent="Please Upload Text File");let e=a(this.value),n=function(t,e){var n=window.levenshtein.get(t,e),r=Math.max(t.length,e.length);if(0===r)return 100;var i=100*(1-n/r);return Math.floor(i)}(window.uploadedText,e);document.getElementById("accuracyDisplay").textContent=`Accuracy: ${n}%`})),document.getElementById("compareText").addEventListener("click",(function(){-1!=window.uploadedText?function(t,e){const n=i.diff_main(t,e);i.diff_cleanupSemantic(n);const r=n.map((([t,e])=>1===t?`<span class="insert">${e}</span>`:-1===t?`<span class="delete">${e}</span>`:`<span class="equal">${e}</span>`)).join("");document.getElementById("differenceOutput").innerHTML=r}(a(document.getElementById("textInput").value),window.uploadedText):document.getElementById("accuracyDisplay").textContent="Please Upload Text File"}))})()})();