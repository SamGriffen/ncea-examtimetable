<script src="js/main.js"></script>
<?php
if($pageData["page_js"] == 1){
?>
<script src="js/pages/<?php echo $pageData["page_name"] ?>.js"></script>
<?php
}
?>

<?php
// If the user needs the flatpickr plugin, load it in
if(in_array($pageData["page_name"], ["home", "admin"])){
?>
<script src="https://unpkg.com/flatpickr@3.0.7/dist/flatpickr.js" defer></script>
<!-- SCRIPT TO DEFER CSS LOADING -->
<script type="text/javascript">
  window.addEventListener("load", function(){
    if (document.createStyleSheet){
      document.createStyleSheet('https://unpkg.com/flatpickr@3.0.7/dist/flatpickr.min.css');
    }
    else {
      var styles = document.createElement("link");
      styles.href = "https://unpkg.com/flatpickr@3.0.7/dist/flatpickr.min.css";
      styles.rel = "stylesheet";
      styles.type = "text/css";
      document.querySelector("head").appendChild(styles);
    }
  });
</script>
<?php
}
?>
