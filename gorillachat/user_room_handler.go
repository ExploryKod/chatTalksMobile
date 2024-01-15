package main

import (
	"github.com/go-chi/chi/v5"
	"net/http"
	"strconv"
)

func (h *Handler) GetUserDiscussions() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		QueryId := chi.URLParam(r, "id")
		id, _ := strconv.Atoi(QueryId)
		println("JE PASSE DANS GETUSERDISCUSSIONS")
		discussions, err := h.Store.GetUserDiscussions(id)
		if err != nil {
			h.jsonResponse(w, http.StatusInternalServerError, map[string]interface{}{
				"message": "Internal Server Error",
			})
			return
		}

		h.jsonResponse(w, http.StatusOK, discussions)
	}
}
