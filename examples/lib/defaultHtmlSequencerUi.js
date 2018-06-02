function DefaultHtmlSequencerUi(_sequencer, options) {

  options = options || {};
  var addStepSel = options.addStepSel = options.addStepSel || "#addStep";
  var removeStepSel = options.removeStepSel = options.removeStepSel || "button.remove";
  var selectStepSel = options.selectStepSel = options.selectStepSel || "#selectStep";

  function onLoad() {
    importStepsFromUrlHash();
  }

  // look up needed steps from Url Hash:
  function importStepsFromUrlHash() {
    var hash = getUrlHashParameter("steps");

    if (hash) {
      var stepsFromHash = hash.split(",");
      stepsFromHash.forEach(function eachStep(step) {
        _sequencer.addSteps(step);
      });
      _sequencer.run(0);
    }
  }

  function selectNewStepUi() {
    var m = $(addStepSel + " select").val();
    $(addStepSel + " .info").html(_sequencer.modulesInfo(m).description);
  }

  function removeStepUi() {
    var index = $(removeStepSel).index(this) + 1;
    sequencer.removeSteps(index).run(sequencer.images.image1.steps.length-1);
    // remove from URL hash too
    var urlHash = getUrlHashParameter("steps").split(",");
    urlHash.splice(index - 1, 1);
    setUrlHashParameter("steps", urlHash.join(","));
  }

  function addStepUi() {
    if ($(addStepSel + " select").val() == "none") return;

    // add to URL hash too
    var hash = getUrlHashParameter("steps") || "";
    if (hash != "") hash += ",";
    setUrlHashParameter("steps", hash + $(addStepSel + " select").val());

    var newStepName = $(addStepSel + " select").val();

    /*
    * after adding the step we run the sequencer from defined step
    * and since loadImage is not a part of the drawarray the step lies at current
    * length - 2 of the drawarray
    */
    _sequencer
    .addSteps(newStepName, options)
    .run(_sequencer.images.image1.steps.length - 2);
  }

  return {
    onLoad: onLoad,
    importStepsFromUrlHash: importStepsFromUrlHash,
    selectNewStepUi: selectNewStepUi,
    removeStepUi: removeStepUi,
    addStepUi: addStepUi
  }
}
