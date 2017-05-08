describe("controller main-loop", function() {
  var spec = {};

  commonSpec(spec);

  describe('initialization functions', function() {
    it("should init all the variables", function() {
    spec.state.init();

	  expect(spec.state.current_element).toEqual("H");
	  expect(spec.state.hover_element).toEqual("");
	  expect(spec.achievement.toast).toEqual([]);
	  expect(spec.achievement.is_toast_visible).toEqual(false);
    });
  });

  describe('onload', function() {
    beforeEach(function() {
			spyOn(spec.savegame, "load");
			spyOn(spec.state, "init");
    });

    it("should load the game", function() {
      // flush onload
      spec.$timeout.flush();

      expect(spec.savegame.load).toHaveBeenCalled();
    });

    it("should load the player", function() {
      spyOn(localStorage, "getItem").and.returnValue("");

      // flush onload
      spec.$timeout.flush();

			expect(spec.savegame.load).toHaveBeenCalled();
    });

    it("should not init if the player exists", function() {
      spec.player.data = "";

      // flush onload
      spec.$timeout.flush();

			expect(spec.state.init).not.toHaveBeenCalled();
    });
  });

  describe('update', function() {
    beforeEach(function() {
      spyOn(spec.achievement, "checkAchievements");
    });

    it("should not update player if nothing is purchased", function() {
      spec.player.data = angular.copy(spec.data.start_player);

      spec.controller.update();

      expect(spec.player.data).toEqual(spec.data.start_player);
    });

    it("should generate isotopes", function() {
      spec.player.data = spec.data.start_player;
      spec.player.data.elements.O.unlocked = true;
      spec.player.data.elements.O.generators['Tier 1'] = 200;
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.util,'getPoisson').and.returnValue(0);

      spec.controller.update();

      expect(spec.player.data.resources['16O'].number).toEqual(200);
      expect(spec.player.data.resources['17O'].number).toEqual(0);
      expect(spec.player.data.resources['18O'].number).toEqual(0);
    });

    it("should generate isotopes 2", function() {
      spec.player.data = spec.data.start_player;
      spec.player.data.elements.O.unlocked = true;
      spec.player.data.elements.O.generators['Tier 1'] = 1200;
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.util,'getPoisson').and.returnValue(0);

      spec.controller.update();

      expect(spec.player.data.resources['16O'].number).toEqual(1197);
      expect(spec.player.data.resources['17O'].number).toEqual(0);
      expect(spec.player.data.resources['18O'].number).toEqual(3);
    });

    it("should generate isotopes 3", function() {
      spec.player.data = spec.data.start_player;
      spec.player.data.elements.O.unlocked = true;
      spec.player.data.elements.O.generators['Tier 1'] = 32000;
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.util,'getPoisson').and.returnValue(0);

      spec.controller.update();

      expect(spec.player.data.resources['16O'].number).toEqual(31923);
      expect(spec.player.data.resources['17O'].number).toEqual(13);
      expect(spec.player.data.resources['18O'].number).toEqual(64);
    });

    it("should process radioactivity", function() {
      spec.player.data = spec.data.start_player;
      spec.player.data.resources['3H'].unlocked = true;
      spec.player.data.resources['3H'].number = 1000;
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.util,'getPoisson').and.returnValue(0);

      spec.controller.update();

      expect(spec.player.data.resources['3H'].number).toEqual(1000);
      expect(spec.player.data.resources['3He+'].number).toEqual(0);
      expect(spec.player.data.resources['e-'].number).toEqual(0);
      expect(spec.player.data.resources.eV.number).toEqual(0);
    });

    it("should process radioactivity 2", function() {
      spec.player.data = spec.data.start_player;
      spec.player.data.resources['3H'].unlocked = true;
      spec.player.data.resources['3H'].number = 1e+10;
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.util,'getPoisson').and.returnValue(18);

      spec.controller.update();

      expect(spec.player.data.resources['3H'].number).toEqual(9999999982);
      expect(spec.player.data.resources['3He+'].number).toEqual(18);
      expect(spec.player.data.resources['e-'].number).toEqual(18);
      expect(spec.player.data.resources.eV.number).toEqual(334980);
    });
  });

  describe('xxxxxxxxxxxxxxxx', function() {
    it("should ", function() {
      //value = spec.$scope.xxxxxx();

      //expect(value).toEqual('xxxxxx');
    });
  });
});