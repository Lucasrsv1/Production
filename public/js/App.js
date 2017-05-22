/**
 * Created by lucas on 21/05/2017.
 */

var app = angular.module('AppProduction', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider.when('/cadastrar', {
		controller: 'Cadastro',
		templateUrl: 'views/cadastrar.html'
	}).when('/relatorio', {
		controller: 'Relatorio',
		templateUrl: 'views/relatorio.html'
	}).otherwise({
		redirectTo: "/cadastrar"
	});
});


app.controller('Menu', ['$scope', function ($scope) {
	$scope.Refresh = function () {
		setTimeout(function () {
			$scope.relatorio_class = window.location.hash === "#!/relatorio" ? "selected" : "";
			$scope.cadastrar_class = window.location.hash === "#!/cadastrar" ? "selected" : "";
			$scope.$apply();
		}, 300);
	}
	
	$scope.Refresh();
}]);