let dropDownOpen = false;

input = document.getElementById("searchTerm").value = "";

if (location.pathname.split("/").slice(-1) == 'game.html' || location.pathname.split("/").slice(-1) == 'profile.html' || location.pathname.split("/").slice(-1) == 'user.html')
    {
      document.getElementById("homeIcon").addEventListener("click", function () {
        window.open("home.html", "_self");
      });
    }

if (location.pathname.split("/").slice(-1) == 'home.html' || location.pathname.split("/").slice(-1) == 'game.html' || location.pathname.split("/").slice(-1) == 'user.html')
{
  document.getElementById("profileIcon").addEventListener("click", function () {
    window.open("profile.html", "_self");
  });
}


var closeIt=function(e){
  var container = document.getElementById("myDropdown");
  if (!container.contains(e.target) && e.target.className != 'fa fa-search'  && e.target.className != 'searchButton') {
      closeDropdown();
  }
}

function filterFunction() {
  var input, filter, a, i;
  input = document.getElementById("searchTerm");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  var count = 0;
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "block";
      count++;
    } else {
      a[i].style.display = "none";
    }
  }
  if(count == 0){
    document.getElementById("noMatchesHolder").style.display = "block";
  }
  else{
    document.getElementById("noMatchesHolder").style.display = "none";
  }
}

function showDropdown(){
  document.getElementById('searchTerm').focus();
  document.getElementById("myDropdown").style.display = "block";
  document.addEventListener('mouseup',closeIt);
  dropDownOpen = true;
}

function closeDropdown(){
  document.getElementById("myDropdown").style.display = "none";
  document.removeEventListener('mouseup',closeIt);
  dropDownOpen = false;
}

function toggle(){
  if(dropDownOpen){
    closeDropdown();
  }
  else{
    showDropdown();
  }
}



