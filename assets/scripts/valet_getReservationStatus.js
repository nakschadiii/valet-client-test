function getReservationStatus(reservation) {
    const now = new Date();
    const stationnement = reservation.stationnements?.[0];
    const reservationDate = new Date(reservation.date_reservation);
    const plannedArrivalDate = new Date(reservation.date_prevue_arrivee);
    const plannedDepartureDate = new Date(reservation.date_prevue_depart);
    const effectiveArrivalDate = stationnement?.date_effective_arrivee ? new Date(stationnement.date_effective_arrivee) : null;
    const effectiveDepartureDate = stationnement?.date_effective_sortie ? new Date(stationnement.date_effective_sortie) : null;

    // Vérification si la réservation est annulée
    if (reservation.statut === 'Annulée') {
        return 'Annulée';
    }

    // Vérification si la réservation est terminée (dates effectives d'arrivée et de départ sont toutes les deux présentes)
    if (effectiveArrivalDate && effectiveDepartureDate) {
        return 'Terminé';
    }

    // Vérification si la réservation est en cours mais l'arrivée n'a pas eu lieu
    if (plannedArrivalDate <= now && !effectiveArrivalDate) {
        return 'En attente d\'arrivée';
    }

    // Vérification si la réservation est en cours et l'arrivée a eu lieu mais le départ est imminent
    if (effectiveArrivalDate && plannedDepartureDate >= now && !effectiveDepartureDate) {
        return 'En attente de départ';
    }

    // Si la réservation est en cours, mais l'arrivée prévue est dans le futur
    if (plannedArrivalDate > now) {
        return 'En cours';
    }

    // Si la date de départ prévue est dans le passé mais l'arrivée n'a pas encore eu lieu
    if (plannedDepartureDate < now && !effectiveArrivalDate) {
        return 'En retard (en attente d\'arrivée)';
    }

    // Si la réservation est en retard (départ prévu passé mais pas encore effectué)
    if (plannedDepartureDate < now && effectiveArrivalDate && !effectiveDepartureDate) {
        return 'En retard (en attente de départ)';
    }

    // Cas où la réservation est en retard pour une autre raison (dépend de votre logique métier)
    if (plannedArrivalDate < now && !effectiveArrivalDate) {
        return 'En retard (arrivée non effectuée)';
    }

    // Statut par défaut si aucune des conditions précédentes ne s'applique
    return 'En cours';
}
