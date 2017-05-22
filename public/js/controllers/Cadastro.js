/**
 * Created by lucas on 21/05/2017.
 */

app.controller('Cadastro', ['$scope', function ($scope) {
	$scope.maquinas = maquinas_global;
	
	$scope.title = "Nova Máquina";
	$scope.submit_btn = "Adicionar";
	$scope.maqIndex = -1;
	
	$scope.SubmitMaquina = function () {
		var form = document.cadastro_form;
		
		if (form.nome.value.length === 0 || isNaN(parseFloat(form.velocidade_producao.value))) {
			alert("Por favor, preencha todos os campos do formulário.");
		} else {
			if ($scope.submit_btn == "Adicionar") {
				$scope.maquinas.push(new Maquina(form.nome.value, form.status.value, parseFloat(form.velocidade_producao.value)));
			} else {
				var check = confirm("Tem certeza que deseja atualizar a máquina " + $scope.maquinas[$scope.maqIndex].nome + "?");
				if (check) {
					$scope.maquinas[$scope.maqIndex].nome = form.nome.value;
					$scope.maquinas[$scope.maqIndex].velocidade_producao = form.velocidade_producao.value;
					if (form.status.value == 1)
						$scope.maquinas[$scope.maqIndex].Produzir();
					else
						$scope.maquinas[$scope.maqIndex].Parar();
				}
				
				$scope.title = "Nova Máquina";
				$scope.submit_btn = "Adicionar";
				$scope.maqIndex = -1;
			}
			
			form.nome.value = "";
			$scope.$apply();
		}
	}
	
	$scope.RemoverMaquina = function (index) {
		var check = confirm("Tem certeza que deseja deletar a máquina " + $scope.maquinas[index].nome + "?");
		if (check) {
			$scope.maquinas.splice(index, 1);
			$scope.$apply();
		}
	}
	
	$scope.EditarMaquina = function (index) {
		var form = document.cadastro_form;
		form.nome.value = $scope.maquinas[index].nome;
		form.velocidade_producao.value = $scope.maquinas[index].velocidade_producao;
		if (form.status.value != $scope.maquinas[index].GetStatusInt())
			ChangeStatus(form.status_btn);
		
		$scope.title = "Editar Máquina";
		$scope.submit_btn = "Concluido";
		$scope.maqIndex = index;
	}
	
	setInterval(function () {
		$scope.$apply();
	}, 1000);
}]);

maquinas_global.push(new Maquina("CAF5839673843", 1, 5));
maquinas_global.push(new Maquina("CAF5839692754", 0, 3));