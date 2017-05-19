/**
 * Created by tcs on 19/05/17.
 */

// TODO: adicionar status atual e incluir a duração no tempo.

var Maquina = function (velocidade_producao) {
	var evento_inicio = null;
	var velocidade_padrao = velocidade_producao;

	this.pecas_produzidas = 0;
	this.refugo = 0;
	this.velocidade_producao = velocidade_producao; // 1 peça a cada X segundos.

	this.tempo_produzindo = 0;
	this.tempo_parado = 0;

	this.produzindo_interval = 0;
	this.parado_interval = 0;

	this.Produzir = function () {
		clearInterval(this.parado_interval);
		this.velocidade_producao = velocidade_padrao; // Inicio ou reinicio da máquina.

		if (evento_inicio !== null)
			this.tempo_parado += Date.now() - evento_inicio;

		evento_inicio = Date.now();
		this.produzindo_interval = setInterval(function (maq) {
			maq.pecas_produzidas++;

			// Mudar de status aleatoriamente para simular.
			var random = Math.random();

			if (random < 0.175)
				maq.Parar();
			else if (random < 0.325)
				maq.velocidade_producao *= 1 + Math.random();
			else if (random < 0.475)
				maq.velocidade_producao *= -1 - Math.random();

		}, this.velocidade_producao * 1000, this);
	}

	this.Parar = function () {
		clearInterval(this.produzindo_interval);

		if (evento_inicio !== null)
			this.tempo_produzindo += Date.now() - evento_inicio;

		evento_inicio = Date.now();
		this.parado_interval = setInterval(function (maq) {
			maq.refugo++;

			// Mudar de status aleatoriamente para simular.
			if (Math.random() < 0.4)
				maq.Produzir();

		}, this.velocidade_producao * 1000, this);
	}
}

function FormatarTempo (ms, includeMS) {
	var meses = ms / 2592000000;
	ms -= meses * 2592000000;
	
	var dias = ms / 86400000;
	ms -= dias * 86400000;
	
	var horas = ms / 3600000;
	ms -= horas * 3600000;
	
	var minutos = ms / 60000;
	ms -= minutos * 60000;
	
	var segundos = ms / 1000;
	ms -= segundos * 1000;
	
	var result = "";
	if (meses > 0)
		result += meses.toString() + (meses > 1 ? " meses " : " mês ");
	
	if (dias > 0 || meses > 0)
		result += dias.toString() + (dias > 1 ? " dias " : " dia ");

	if (horas > 0 || dias > 0 || meses > 0)
		result += horas.toString() + " hr ";

	if (minutos > 0 || horas > 0 || dias > 0 || meses > 0)
		result += minutos.toString() + "min ";

	result += segundos.toString() + "sec";
	
	if (includeMS)
		result += " " + ms.toString() + "ms"

	return result;
}