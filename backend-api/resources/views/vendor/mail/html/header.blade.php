@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="https://static.wikia.nocookie.net/elite-dangerous/images/5/54/Elite_Dangerous_Logo_Clean_Vector_Big.png" height="50" alt="Elite Manager">
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>
